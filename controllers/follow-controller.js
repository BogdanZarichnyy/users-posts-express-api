const { prisma } = require("../prisma/prisma-client");

const FollowController = {
    followUser: async (req, res) => {
        const { followingId } = req.body;
        const userId = req.user.userId;
        
        if (followingId === userId) {
            return res.status(500).json({ error: 'Ви не можете підписатися на самого себе' });
        }

        try {
            const existingSubscription = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId }
                    ]
                }
            });

            if (existingSubscription) {
                return res.status(400).json({ error: 'Підписка вже існує' });
            }

            await prisma.follows.create({
                data: {
                    follower: { connect: { id: userId } },
                    following: { connect: { id: followingId } },
                }
            });

            res.status(201).json({ message: 'Підписка успішно створена' });
        } catch (error) {
            console.error('Create follow user error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    unfollowUser: async (req, res) => {
        const { followingId } = req.body;
        const userId = req.user.userId;

        try {
            const follows = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId },
                    ]
                }
            });

            if (!follows) {
                return res.status(404).json({ error: 'Ви не підписані на йього користувача' });
            }

            await prisma.follows.delete({
                where: { id: follows.id }
            });

            res.status(201).json({ message: 'Ви відписалися' });
        } catch (error) {
            console.error('Delete follow user error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = FollowController;