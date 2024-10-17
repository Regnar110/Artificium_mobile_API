import { HttpStatus } from '@nestjs/common';

export const RedisResponses = {
  sessionNotDeleted: {
    status: HttpStatus.NOT_FOUND,
    message: 'Something went wrong. Try again or contact us.',
    payload: {
      redirect: null,
      data: null,
    },
  },
};
