import { defineStore } from 'pinia';
import { useApiFetch } from '@composables/useApiFetch';

import Cookies from 'js-cookie';

import type {
  ILoginRequest,
  ILoginResponse,
  ILogoutResponse,
  IRegisterRequest,
  IRegisterResponse,
  IUserResponse,
} from '@models/api/auth';

import type { IUser } from '@models/user';

interface IAuthState {
  authenticated: boolean;
  authorized: boolean;
  user: IUser | null;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    authenticated: false,
    authorized: false,
    user: null,
    token: '',
  }),
  actions: {
    async login(request: ILoginRequest) {
      const url = '/api/login';

      const { data, error, status } = await useApiFetch<ILoginResponse>(url, {
        cache: 'no-cache',
        method: 'post',
        body: JSON.stringify(request),
        headers: { 'Content-Type': 'application/json' },
      });

      if (status === 200) {
        if (data) {
          this.token = data.token;
          this.authenticated = true;

          if (this.token) {
            Cookies.set('token', this.token, { expires: 1 });
          }
        }

        // запрос сессии
        await this.getSession();
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }

      return { data, error, status };
    },
    async logout() {
      const url = '/api/logout';
      const { data, error, status } = await useApiFetch<ILogoutResponse>(url, {
        cache: 'no-cache',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
      });

      if (status === 200) {
        if (data) {
          this.authenticated = false;
          this.authorized = false;
          this.token = '';
          Cookies.remove('token');

          console.log(data.message);
        }
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }
    },
    async register(request: IRegisterRequest) {
      const url = '/api/register';

      const { data, error, status } = await useApiFetch<IRegisterResponse>(
        url,
        {
          cache: 'no-cache',
          method: 'post',
          body: JSON.stringify(request),
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (status === 201) {
        if (data) {
          await this.login({
            email: request.email,
            password: request.password,
          });
        }
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }

      return { data, error, status };
    },
    async getSession() {
      const url = '/api/current';
      const { data, error, status } = await useApiFetch<IUserResponse>(url);

      if (status === 200) {
        if (data) {
          this.user = data;
          this.authenticated = true;
          this.authorized = true;
        }
      }

      if (error) {
        throw new Error(JSON.stringify(error));
      }
    },
  },
});
