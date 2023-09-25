import {
  CACHE_MANAGER,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
  Response,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as util from "util";
import { Reflector } from "@nestjs/core";

export interface Response<T> {
  data: T;
}

@Injectable()
export default class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const response = context.switchToHttp().getResponse();
    const message = this.reflector.get<string>("message", context.getHandler());

    return next.handle().pipe(
      map((data) => {
        const responseMessage = message || "Operation Executed Successfully";
        response.status(HttpStatus.OK);
        return {
          success: true,
          message: responseMessage,
          data,
        };
      }),
    );
  }
}
