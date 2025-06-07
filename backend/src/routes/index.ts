import { Router } from 'express';
import { celebrate } from 'celebrate';

import { registerValidation, loginValidation } from '@middlewares/validation';

import UserController from '@controllers/users';

import contactsRouter from '@routes/contacts';

import authenticateToken from '@middlewares/auth';

const router = Router();

// Маршруты пользователя
router.post(
  '/register',
  celebrate(registerValidation),
  UserController.register,
);
router.post('/login', celebrate(loginValidation), UserController.login);

router.use(authenticateToken);

router.post('/logout', UserController.logout);

router.get('/current', UserController.getCurrentUser);

router.use('/', contactsRouter); // Маршруты постов

export default router;
