import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, BadRequestException } from '@nestjs/common';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof BadRequestException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    response.status(status).json({
      status: status,
      error: 'Invalid data formatting, please check your return data and try again',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}