import express from 'express';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser, addFriend, deleteFriend } from '../controllers/user-controller';

const router = express.Router();

// /api/users
router.route('/')
  .get(getAllUsers)
  .post(createUser);

// /api/users/:userId
router.route('/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

export default router;
