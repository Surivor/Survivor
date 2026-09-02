import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class HealthController {

  @ApiOperation({ summary: 'API health' })
  @ApiResponse({
    status: 200,
    description: 'current status',
    schema: { example: { status: 'UP', version: '1.0.0', timestamp: '2026-09-02T10:00:00.000Z' } }
  })
  @Get('health')
  getHealth() {
    return {
      status: 'UP',
      version: '0.1.3',
      timestamp: new Date().toISOString()
    };
  }
}