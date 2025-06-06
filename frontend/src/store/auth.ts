import { defineStore } from 'pinia';

import type { IUser } from '@models/user';

interface IAuthState {
  authenticated: boolean;
  user: IUser | null;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    authenticated: true,
    user: null,
    token: '',
  }),
  actions: {
    async login(request) {
      const url = '/api/login';
    },
    async register(request) {
      const url = '/api/register';
    },
  },
});
