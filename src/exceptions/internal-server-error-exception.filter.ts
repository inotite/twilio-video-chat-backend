import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof InternalServerErrorException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    response.status(status).json({
      status: status,
      error: 'Something wrong happened. Keep calm and try again',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}