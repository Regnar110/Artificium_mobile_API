import { LoginDto } from 'src/User/domains/userManagement/presentation/dto/login.dto';
import { AuthLoginRequestPayload } from 'src/User/types/auth.types';
import { CreateUserRequestPayload } from 'src/User/types/createUser.types';

type ExtractFieldValueDataType = LoginDto | CreateUserRequestPayload;

export function extractFieldValue<ReturnT>(
  data: ExtractFieldValueDataType,
): ReturnT {
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
