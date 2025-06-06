import { defineStore } from 'pinia';

import type { IContact } from '@models/contact';

interface IContactResponse extends IContact {
  id: string;
  lastInteractive: string;
}

interface IAppState {
  contacts: IContactResponse[];
}

const EXPAMPLE_CONTACTS = [
  {
    id: '1',
    name: 'Андрей',
    phone: '+79223156070',
    email: 'andre@mail.ru',
    tags: ['раз', 'два', 'три'],
    lastInteractive: '2025-02-31',
  },
  {
    id: '2',
    name: 'Владимир',
    phone: '+79669990022',
    email: 'vlad@gmail.com',
    tags: ['тег1', 'тег3', 'тег5', 'тег 6'],
    lastInteractive: '2025-03-12',
  },
  {
    id: '3',
    name: 'Зариф',
    phone: '+79331112233',
    email: 'zar@yandex.zi',
    tags: ['единственныйтег'],
    lastInteractive: '2025-04-04',
  },
  {
    id: '4',
    name: 'Рафаэль',
    phone: '+791144433223',
    email: 'raf@raf.en',
    tags: [],
    lastInteractive: '2025-04-05',
  },
];

export const useAppStore = defineStore('app', {
  state: (): IAppState => ({
    contacts: EXPAMPLE_CONTACTS,
  }),
  actions: {
    async getContacts() {
      return this.contacts;
    },
    addContact(request: IContactResponse) {
      this.contacts.push(request);
    },
  },
});
