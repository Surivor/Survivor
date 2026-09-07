import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { SirhService } from './sirh.service';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@ApiTags('SIRH')
@Controller('api/sirh')
export class SirhController {
    constructor(private readonly sirhService: SirhService) {}

    @ApiOperation({ summary: 'Récupérer la liste des employés et leurs soldes (pour SIRH)' })
    @ApiHeader({ name: 'x-api-key', description: 'Clé API SIRH fournie dans le dashboard' })
    @Get('employees')
    async getEmployees(@Headers('x-api-key') apiKey: string) {
        if (!apiKey) {
            throw new UnauthorizedException('Clé API manquante');
        }
        return this.sirhService.getEmployees(apiKey);
    }
}
