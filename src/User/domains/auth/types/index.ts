export interface AuthLoginPayloadInterface {
  fields: AuthLoginFieldsInterface;
  formId: string;
}

export interface AuthLoginFieldsInterface {
  email: AuthLoginUserEmailInterface;
  password: AuthLoginUserPasswordInterface;
}
export interface AuthLoginUserEmailInterface {
  id: string;
  value: string;
}

export interface AuthLoginUserPasswordInterface {
  id: string;
  value: string;
}
