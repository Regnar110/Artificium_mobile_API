import { HttpStatus } from '@nestjs/common';
import { REDIRECT } from 'src/services/ResponseBuilder/redirectors.constant';
import { ResponseModelDto } from 'src/services/ResponseBuilder/responseModel.dto';

export const UserResponses = {
  register: {
    emailExist: {
      status: HttpStatus.CONFLICT,
      message: 'User already exist',
      payload: {
        redirect: null,
        data: {
          clientMessage: 'This email is already used.',
        },
      },
    },

    userCreated: {
      status: HttpStatus.CREATED,
      message: 'User registered successfully.',
      payload: {
        redirect: REDIRECT.SIGN_IN,
        data: {
          clientMessage:
            'User registered successfully. Use your passwords to log in.',
        },
      },
    },

    userNotCreated: {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'The user has not been registered.',
      payload: {
        redirect: null,
        data: {
          clientMessage:
            'Something went wrong. Please refresh the app and try again or contact us.',
        },
      },
    },
  },
};
