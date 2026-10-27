const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/comments', protect, addComment);

module.exports = router;