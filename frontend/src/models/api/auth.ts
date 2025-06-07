import type { IUser } from '@models/user';

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
}

export interface ILogoutResponse {
  message: string;
}

export interface IRegisterRequest extends ILoginRequest {
  lastName: string;
  name: string;
}

export type IRegisterResponse = IUser;

export type IUserResponse = IUser;
