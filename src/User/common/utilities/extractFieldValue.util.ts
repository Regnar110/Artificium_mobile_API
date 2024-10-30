import { LoginPayloadDto } from 'src/User/domains/auth/presentation/dto/authLoginPayloadDto/loginPayload.dto';
import { RegisterPayloadDto } from 'src/User/domains/userManagement/presentation/dto/registerPayload';
type ExtractFieldValueDataType = LoginPayloadDto | RegisterPayloadDto;

export function extractFieldValue<ReturnT>(
  data: ExtractFieldValueDataType,
): ReturnT {
  const transformedObject = {};

  for (const key in data.fields) {
    transformedObject[key] = data.fields[key].value;
  }
  delete transformedObject['repeatpassword'];

  // if ('agreementFields' in data) {
  //   transformedObject['agreementFields'] = [...data.agreementFields];
  // }

  return transformedObject as ReturnT;
}
