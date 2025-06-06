export interface IContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  lastInteractive?: string;
}

export interface IContactFormData {
  name: string;
  phone: string;
  email: string;
  tags: string[];
}
