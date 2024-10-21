import { AgreementContentInterface } from './agreements.types';

export interface CreateUserRequestPayload {
  formId: string;
  fields: {
    email: { id: 'email'; value: string };
    firstname: { id: 'firstname'; value: string };
    lastname: { id: 'lastname'; value: string };
    password: { id: 'password'; value: string };
    repeatpassword: { id: 'repeatpassword'; value: string };
  };
  agreementFields: AgreementContentInterface[];
}
