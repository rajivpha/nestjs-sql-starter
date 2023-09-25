import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AppService } from '@src/app.service';
import { CurrentUserPayload, TokenPayload } from '@src/interfaces/common.interface';
import { Observable } from 'rxjs';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly appService: AppService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    return next.handle();
  }
}
