import type { IContact, IContactFormData } from '@models/contact';

export type IContactAddRequest = IContactFormData;
export type IContactEditRequest = IContactFormData;

export type IContactsResponse = IContact[];
