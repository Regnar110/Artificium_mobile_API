export interface RegisterPayload {
  formId: string;
  fields: {
    [key: string]: { id: string; value: string };
  };
}
