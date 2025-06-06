interface IUser {
  id: string;
  email: string;
  password: string;
  name: string | null;
  lastName: string | null;
  createdAt: Date;
}

interface IRequestUser {
  userId: string;
}

export { IUser, IRequestUser };
