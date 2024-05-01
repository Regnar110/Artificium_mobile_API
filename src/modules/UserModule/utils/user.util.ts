import { RegisterPayload, SignInPayload } from '../user.model';

type ExtractFieldValueDataType = SignInPayload | RegisterPayload;

export default class UserRepo {
  static extractFieldValue<ReturnT>(data: ExtractFieldValueDataType): ReturnT {
    const transformedObject = {};

    for (const key in data.fields) {
      transformedObject[key] = data.fields[key].value;
    }
    delete transformedObject['repeatpassword'];

    if ('agreementFields' in data) {
      transformedObject['agreementFields'] = [...data.agreementFields];
    }

    return transformedObject as ReturnT;
  }
}
