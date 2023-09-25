import { applyDecorators, SetMetadata } from "@nestjs/common";

export const ResponseMessage = (message: string): any =>
  applyDecorators(SetMetadata("message", message.toLocaleLowerCase()));
