import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    console.log(request.headers);
    const user = request.user;
    console.log(user);
    return user;
  },
);
