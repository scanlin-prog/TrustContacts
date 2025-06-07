import type { IContact, IContactFormData } from '@models/contact';

export interface IContactResponse extends IContact {
  authorId: string;
  createdAt: string;
}

export type IContactAddRequest = IContactFormData;

export interface IContactDeleteResponse {
  id: string;
}
