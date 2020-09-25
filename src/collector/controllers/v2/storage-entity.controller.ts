import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { StorageEntityResponseDto } from '../../dto/storage-entity-response.dto';
import { StorageEntityService } from '../../services/storage-entity.service';
import { StorageEntityRequestDto } from '../../dto/storage-entity-request.dto';
import { StorageEntityTransformer } from '../../transformers/storage-entity.transformer';
import { StorageEntityRequestPipe } from '../../dto/pipes/storage-entity-request.pipe';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { StorageEntityDetailRequestDto } from '../../dto/storage-entity-base-request.dto';

@Controller('api/v2/storage-entities')
export class StorageEntityController {
  constructor(
    private storageEntityService: StorageEntityService,
  ) {
  }

  @Get()
  public async getAll(): Promise<StorageEntityResponseDto[]> {
    const entities = await this.storageEntityService.getAllSystems();
    return StorageEntityTransformer.transformAll(entities, true, true);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiCreatedResponse({
    description: 'Storage entity created',
    type: StorageEntityResponseDto,
  })
  public async createStorageEntity(
    @Body(new StorageEntityRequestPipe()) request: StorageEntityRequestDto,
  ): Promise<StorageEntityResponseDto> {
    const entity = await this.storageEntityService.create(request);
    return StorageEntityTransformer.transform(entity);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Record updated',
    type: StorageEntityResponseDto,
  })
  public async addDetails(
    @Param('id') id: number,
    @Body(new StorageEntityRequestPipe()) request: StorageEntityDetailRequestDto,
  ): Promise<StorageEntityResponseDto> {
    const entity = await this.storageEntityService.update(id, request);
    return StorageEntityTransformer.transform(entity);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  public async delete(
    @Param('id') id: number,
  ) {
    await this.storageEntityService.delete(id);
  }

  @Put(':id/new-parent/:parent')
  @ApiNoContentResponse()
  public async move(
    @Param('id') id: number,
    @Param('parent') parentId: number,
  ) {
    await this.storageEntityService.move(id, parentId);
  }
}
