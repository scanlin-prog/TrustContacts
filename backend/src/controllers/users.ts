import { NextFunction, Request, Response } from 'express';
import prisma from 'prisma/prisma-client';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import BadRequestError from '@errors/bad-request';
import UnauthorizedError from '@errors/unauthorized';
import NotFoundError from '@errors/not-found';
import ConflictError from '@errors/conflict';

import { handleError, handleRequestUserId } from '@utils/utils';

const { NODE_ENV, JWT_SECRET } = process.env;

const UserController = {
  register: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password, name, lastName } = req.body;

      // Проверка обязательных полей
      if (!email || !password || !name || !lastName) {
        throw new BadRequestError('Все поля обязательные!');
      }

      // Проверка существующего пользователя
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictError('Пользователь уже существует');
      }

      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создание нового пользователя
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          lastName,
        },
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          createdAt: true,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      handleError(error, next);
    }
  },
  login: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Проверка обязательных полей
      if (!email || !password) {
        throw new BadRequestError('Все поля обязательные!');
      }

      // Поиск пользователя
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Оставляем такой код, потому что TS ругается
      // на отсутствие пользователя даже при работе обработчика
      if (!user) {
        throw new UnauthorizedError('Неверный логин или пароль');
      }

      // Проверка пароля
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new UnauthorizedError('Неверный логин или пароль');
      }

      // Проверка переменной окружения
      if (!JWT_SECRET) {
        console.log('Отсутствует секретный ключ');
        return;
      }

      // Получение токена авторизации
      // и запись id пользователя в userId запроса пользователя
      const token = jwt.sign(
        { userId: user.id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.status(200).json({ token });
    } catch (error) {
      handleError(error, next);
    }
  },
  logout: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = handleRequestUserId(req);

      // Проверка существования id пользователя
      if (!userId) {
        throw new NotFoundError('Не удалось найти пользователя');
      }

      res.status(200).json({ message: 'Вы успешно вышли из аккаунта' });
    } catch (error) {
      handleError(error, next);
    }
  },
  getCurrentUser: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = handleRequestUserId(req);

      // Проверка существования id пользователя
      if (!userId) {
        throw new NotFoundError('Не удалось найти пользователя');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
        },
      });

      // Проверка существующего пользователя
      if (!user) {
        throw new NotFoundError('Не удалось найти пользователя');
      }

      res.status(200).json(user);
    } catch (error) {
      handleError(error, next);
    }
  },
};

export default UserController;
