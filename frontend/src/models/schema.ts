export interface ISchemaItem {
  id?: string | number | null;
  type?: string;
  name: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  mask?: string;
  maskToken?: string;
}

export interface ISelectItem {
  id: string | number;
  value: string | number;
  title: string;
  disabled?: boolean;
  cityId?: string;
  workshopId?: string;
}
