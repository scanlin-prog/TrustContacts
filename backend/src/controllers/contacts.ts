import { NextFunction, Request, Response } from 'express';
import prisma from 'prisma/prisma-client';

import BadRequestError from '@errors/bad-request';
import ForbiddenError from '@errors/forbidden';
import NotFoundError from '@errors/not-found';

import { handleError, handleRequestUserId } from '@utils/utils';

const ContactController = {
  createContact: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name, phone, email, tags } = req.body;
      const authorId = handleRequestUserId(req);

      // Проверка обязательных полей
      if (!name || !phone || !email) {
        throw new BadRequestError('Все поля обязательные!');
      }

      // Проверка существования id пользователя
      if (!authorId) {
        throw new NotFoundError('Не удалось найти пользователя');
      }

      const contact = await prisma.contact.create({
        data: {
          name,
          phone,
          email,
          tags,
          authorId,
        },
      });

      res.status(201).json(contact);
    } catch (error) {
      handleError(error, next);
    }
  },
  getContacts: async (
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

      const contacts = await prisma.contact.findMany({
        where: {
          authorId: userId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      res.status(200).json(contacts);
    } catch (error) {
      handleError(error, next);
    }
  },
  updateContact: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, phone, email, tags } = req.body;
      const userId = handleRequestUserId(req);

      // Проверка существования id пользователя
      if (!userId) {
        throw new NotFoundError('Не удалось найти пользователя');
      }

      const contact = await prisma.contact.findUnique({ where: { id } });

      // Проверка на существование контакта
      if (!contact) {
        throw new BadRequestError('Контакт не найден');
      }

      if (contact.authorId !== userId) {
        throw new ForbiddenError('Доступ к обновлению контакта запрещен');
      }

      const updatedContact = await prisma.contact.update({
        where: { id },
        data: {
          name,
          phone,
          email,
          tags,
          lastInteraction: new Date(),
        },
      });

      res.status(200).json(updatedContact);
    } catch (error) {
      handleError(error, next);
    }
  },
  deleteContact: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = handleRequestUserId(req);

      // Проверка существования id пользователя
      if (!userId) {
        throw new NotFoundError('Не удалось найти пользователя');
      }

      const contact = await prisma.contact.findUnique({ where: { id } });

      // Проверка на существование контакта
      if (!contact) {
        throw new BadRequestError('Контакт не найден');
      }

      if (contact.authorId !== userId) {
        throw new ForbiddenError('Доступ к удалению контакта запрещен');
      }

      // Удаляем контакт
      const deletedContact = await prisma.contact.delete({ where: { id } });

      res.status(200).json({ id: deletedContact.id });
    } catch (error) {
      handleError(error, next);
    }
  },
  searchContacts: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { query } = req.body;
      const authorId = handleRequestUserId(req);

      // Проверка обязательных полей
      if (!query) {
        throw new BadRequestError('Все поля обязательные!');
      }

      // Проверка существования id пользователя
      if (!authorId) {
        throw new NotFoundError('Не удалось найти пользователя');
      }

      const contacts = await prisma.contact.findMany({
        where: {
          name: query,
        },
      });

      if (!contacts.length) {
        throw new BadRequestError(
          'Переданы некорретные данные, повторите запрос!',
        );
      }

      res.status(200).json(contacts);
    } catch (error) {
      handleError(error, next);
    }
  },
};

export default ContactController;
