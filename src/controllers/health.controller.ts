import { StatusCodes } from 'http-status-codes';
import { Get, HttpCode, JsonController } from 'routing-controllers';

@JsonController('/health')
export class HealthController {
    @HttpCode(StatusCodes.OK)
    @Get()
    healthCheck() {
        return {
            status: StatusCodes.OK,
            message: 'Service health is okay.',
        };
    }
}
