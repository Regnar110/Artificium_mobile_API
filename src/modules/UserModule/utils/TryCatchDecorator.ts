import { HttpStatus } from '@nestjs/common';
import { ResponseBuilderService } from 'src/services/ResponseBuilder/responseBuilder.service';

type ServerResponseCustomType = {
  status: (status: number) => void;
  json: (body: unknown) => void;
};

/**
 * @customAPI
 * @requires ResponseBuilderService
 * @requires Response
 * @returns modified original method - enchanced by wrapping its content with try catch block and error handling based on nest
 * HTTPS exceptions and response builder service.
 */

export function TryCatch() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const responseService: ResponseBuilderService = this.responseBuilder;
        const serverResponse: ServerResponseCustomType = args.find(
          (arg) => arg.constructor.name === 'ServerResponse',
        );
        if (!serverResponse) {
          throw new Error(
            `${this.constructor.name} on ${originalMethod.name} with @TryCatch decorator - Could not find ServerResponse!`,
          );
        }

        if (!responseService) {
          throw new Error(
            `${this.constructor.name} on ${originalMethod.name} with @TryCatch decorator - Could not find ResponseServiceBuilder attached to class constructor!`,
          );
        }
        serverResponse.json(
          responseService.buildStandardResponse({
            status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            message: `catched with class ${this.constructor.name} on method ${originalMethod.name}`,
            payload: null,
          }),
        );
      }
    };

    return descriptor;
  };
}
