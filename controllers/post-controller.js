const { prisma } = require("../prisma/prisma-client");

const PostController = {
    createPost: async (req, ers) => {
        res.send('createPost');
    },
    getAllPosts: async (req, ers) => {
        res.send('getAllPosts');
    },
    getPostById: async (req, ers) => {
        res.send('getPostById');
    },
    deletePostById: async (req, ers) => {
        res.send('deletePost');
    }
};

module.exports = PostController;