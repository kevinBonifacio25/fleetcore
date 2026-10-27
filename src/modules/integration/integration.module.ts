/** Exposes the API-key-protected endpoint for external fleet integrations. */
import { Controller, Get, Module, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards';

@ApiTags('Integration')
@Controller('integration')
class IntegrationController {
  @Get('fleet-summary')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Consultar resumen protegido por API Key' })
  getFleetSummary() {
    return {
      service: 'FleetCore',
      message: 'API Key válida',
      description: 'Endpoint de integración externa',
    };
  }
}

@Module({
  controllers: [IntegrationController],
  providers: [ApiKeyGuard],
})
export class IntegrationModule {}
