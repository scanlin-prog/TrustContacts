import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createContactValidation,
  checkIdValidation,
} from '@middlewares/validation';

import ContactController from '@controllers/contacts';

const contactsRouter = Router();

contactsRouter.post(
  '/contacts',
  celebrate(createContactValidation),
  ContactController.createContact,
);
contactsRouter.get('/contacts', ContactController.getContacts);
contactsRouter.put(
  '/contacts/:id',
  celebrate(checkIdValidation),
  ContactController.updateContact,
);
contactsRouter.delete(
  '/contacts/:id',
  celebrate(checkIdValidation),
  ContactController.deleteContact,
);

export default contactsRouter;
