const { prisma } = require("../prisma/prisma-client");

const CommentController = {
    createComment: async (req, res) => {
        const { postId, content } = req.body;
        const userId = req.user.userId;

        if(!postId || !content) {
            return res.status(400).json({ error: 'Всі поля обов\'язкові' });
        }

        try {
            const comment = await prisma.comment.create({
                data: {
                    postId,
                    userId,
                    content
                }
            });

            res.json(comment);
        } catch (error) {
            console.error('Create comment error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    deleteCommentById: async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        try {
            const comment = await prisma.comment.findUnique({ where: { id } });

            if (!comment) {
                return res.status(404).json({ error: 'Коментарій не знайдений' });
            }

            if (comment.userId !== userId) {
                return res.status(403).json({ error: 'Немає доступу' });
            }

            await prisma.comment.delete({ where: { id } });

            res.json(comment);
        } catch (error) {
            console.error('Delete comment by id error', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = CommentController;