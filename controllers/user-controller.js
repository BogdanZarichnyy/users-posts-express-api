const { prisma } = require("../prisma/prisma-client");
const bCrypt = require('bcryptjs');
const jDentIcon = require('jdenticon');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { error } = require("console");

const UserController = {
    register: async (req, res) => {
        const { email, password, name } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Всі поля обо\'язкові' });
        }

        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ error: 'Користувач вже існує' });
            }

            const hashedPassword = await bCrypt.hash(password, 10);

            const pngIcon = jDentIcon.toPng(name, 200);
            const avatarName = `${name}_${Date.now()}.png`;
            const avatarPath = path.join(__dirname, '../uploads', avatarName);
            fs.writeFileSync(avatarPath, pngIcon);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    avatarUrl: `/uploads/${avatarPath}`
                }
            });

            res.json(user);
        } catch (error) {
            console.error('Error in register', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Всі поля обо\'язкові' });
        }

        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(400).json({ error: 'Невірний логін або пароль' });
            }

            const validPassword = await bCrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(400).json({ error: 'Невірний логін або пароль' });
            }

            const token = jwt.sign(({ userId: user.id }), process.env.SECRET_KEY);

            res.json({ token });
        } catch (error) {
            console.error('Error in login', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getUserById: async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        try {
            const user = await prisma.user.findUnique({ 
                where: { id }, 
                include: {
                    followers: true,
                    following: true
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'Користувач не знайдений' });
            }

            const isFollowing = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId: id }
                    ]
                }
            });

            res.json({ ...user, isFollowing: Boolean(isFollowing) });
        } catch (error) {
            console.error('Get Current Error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    updateUser: async (req, res) => {
        const { id } = req.params;
        const { email, name, dateOfBirth, bio, location } = req.body;

        let filePath;

        if (req.file && req.file.path) {
            filePath = req.file.path;
        }

        if (id !== req.user.userId) {
            return res.status(403).json({ error: 'Немає доступу' });
        }

        try {
            if (email) {
                const existingUser = await prisma.user.findFirst({
                    where: { email: email }
                });

                if (existingUser && existingUser.id !== id) {
                    return res.status(400).json({ error: 'Такий E-mail вже використовується' });
                }
            }

            const user = await prisma.user.update({
                where: { id },
                data: {
                    email: email || undefined,
                    name: name || undefined,
                    avatarUrl: filePath ? `${filePath}` : undefined,
                    dateOfBirth: dateOfBirth || undefined,
                    bio: bio || undefined,
                    location: location || undefined
                }
            });

            res.json(user);
        } catch (error) {
            console.error('Update User Error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    currentUser: async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.userId
                },
                include: {
                    followers: {
                        include : {
                            follower: true
                        }
                    },
                    following: {
                        include: {
                            following: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(400).json({ error: 'Не вдалося знайти користувача' })
            }

            res.json(user);
        } catch (error) {
            console.error('Get Current Error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}

module.exports = UserController