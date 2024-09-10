import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';

type ServerResponseCustomType = {
  status: (status: number) => void;
  json: (body: unknown) => void;
};

/**
 * @customAPI
 * @requires ResponseBuilderService
 * @requires Response
 * @important - Only to use with controller top level methods. In order to catch erros from inside of nested controller method just use
 * ResponseBuilderService with throwInternalError method.
 * @returns modified original method - enchanced by wrapping its content with try catch block and error handling based on nest
 * HTTPS exceptions and response builder service.
 */

interface ErrorConstructor extends HttpException {
  new (message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
}

export function TryCatch(errorConstructor?: typeof HttpException) {
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
          if (errorConstructor) {
            throw new HttpException(
              `${error.message} --- inside ${this.constructor.name} on controller method ${originalMethod.name}` ||
                `catched with class ${this.constructor.name} on method ${originalMethod.name}`,
              HttpStatus.BAD_REQUEST,
            );
          }

          throw new Error(
            `${this.constructor.name} on ${originalMethod.name} with @TryCatch decorator - Could not find ServerResponse!`,
          );
        }

        if (!responseService) {
          throw new Error(
            `${this.constructor.name} on ${originalMethod.name} with @TryCatch decorator - Could not find ResponseServiceBuilder attached to class constructor!`,
          );
        }
        const responseObject = responseService.buildStandardResponse({
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            `${error.message} --- inside ${this.constructor.name} on controller method ${originalMethod.name}` ||
            `catched with class ${this.constructor.name} on method ${originalMethod.name}`,
          payload: null,
        });

        if (serverResponse) {
          serverResponse.json(responseObject);
        }
      }
    };

    return descriptor;
  };
}
