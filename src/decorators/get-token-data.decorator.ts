import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '@src/interfaces/common.interface';

export const GetTokenData = createParamDecorator(
  (data: string, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers);
    // const user: TokenPayload = request.headers['x-user-data']
    //   ? JSON.parse(request.headers['x-user-data'])
    //   : {};
    const user: TokenPayload = request.user || {};
    console.log(user);
    return data ? user?.[data] : user;
  }
);
