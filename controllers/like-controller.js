const { prisma } = require("../prisma/prisma-client");

const LikeController = {
    likePost: async (req, res) => {
        const { postId } = req.body;
        const userId = req.user.userId;
        
        if (!postId) {
            return res.status(400).json({ error: 'Всі поля обов\'язкові' });
        }

        try {
            const existngLike = await prisma.like.findFirst({
                where: { postId, userId }
            });

            if (existngLike) {
                return res.status(400).json({ error: 'Ви вже поставили лайк' });
            }

            const like = await prisma.like.create({
                data: { postId, userId }
            });

            res.json(like);
        } catch (error) {
            console.error('Create like error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    unlikePost: async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;


        if (!id) {
            return res.status(400).json({ error: 'Ви вже поставили дизлайк' });
        }

        try {
            const existngLike = await prisma.like.findFirst({
                where: { postId: id, userId }
            });

            if (!existngLike) {
                return res.status(400).json({ error: 'Неможливо поставили дизлайк' });
            }

            const like = await prisma.like.deleteMany({
                where: { postId: id, userId }
            });

            res.json(like);
        } catch (error) {
            console.error('Delete like error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = LikeController;