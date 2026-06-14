import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { updateUserSchema } from '../models/user.schema';

const router = Router();

// Global Protection Guard: Locks down all routes inside this file
router.use(protect);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', userController.remove);

export default router;