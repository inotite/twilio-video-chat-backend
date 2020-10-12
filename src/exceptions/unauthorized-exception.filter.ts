import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof UnauthorizedException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    response.status(status).json({
      status: status,
      error: 'Your login credentials are incorrect. Please try again',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}