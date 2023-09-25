import { Global, Module } from "@nestjs/common";
import { ApiCallHelper } from "./api-call.helper";

@Global()
@Module({
  imports: [],
  providers: [ApiCallHelper],
  exports: [ApiCallHelper],
})
export class HelperModule {}
