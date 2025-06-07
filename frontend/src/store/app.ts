import { defineStore } from 'pinia';
import { useApiFetch } from '@composables/useApiFetch';

import type { IContact } from '@models/contact';
import type {
  IContactResponse,
  IContactAddRequest,
  IContactDeleteResponse,
} from '@models/api/contacts';

interface IAppState {
  contacts: IContactResponse[];
}

export const useAppStore = defineStore('app', {
  state: (): IAppState => ({
    contacts: [],
  }),
  actions: {
    async getContacts() {
      const url = '/api/contacts';

      const { data, error, status } =
        await useApiFetch<IContactResponse[]>(url);

      if (status === 200) {
        if (data) {
          this.contacts = data;
        }
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }

      return { data, error, status };
    },
    async addContact(request: IContactAddRequest) {
      const url = '/api/contacts';

      const { data, error, status } = await useApiFetch<IContactResponse>(url, {
        cache: 'no-cache',
        method: 'post',
        body: JSON.stringify(request),
        headers: { 'Content-Type': 'application/json' },
      });
      if (status === 201) {
        if (data) {
          this.contacts.push(data);
        }
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }

      return { data, error, status };
    },
    async updateContact(id: string, request: IContactAddRequest) {
      const url = `/api/contacts/${id}`;

      const { data, error, status } = await useApiFetch<IContactResponse>(url, {
        cache: 'no-cache',
        method: 'put',
        body: JSON.stringify(request),
        headers: { 'Content-Type': 'application/json' },
      });
      if (status === 200) {
        if (data) {
          await this.getContacts();
        }
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }

      return { data, error, status };
    },
    async deleteContact(id: string) {
      const url = `/api/contacts/${id}`;

      const { data, error, status } = await useApiFetch<IContactDeleteResponse>(
        url,
        {
          cache: 'no-cache',
          method: 'delete',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (status === 200) {
        if (data) {
          await this.getContacts();
        }
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }

      return { data, error, status };
    },
    async searchContacts(query: string) {
      const url = `/api/search`;

      const { data, error, status } = await useApiFetch<IContactResponse[]>(
        url,
        {
          cache: 'no-cache',
          method: 'post',
          body: JSON.stringify({
            query: query,
          }),
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (status === 200) {
        if (data) {
          this.contacts = data;
        }
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }

      return { data, error, status };
    },
  },
});
