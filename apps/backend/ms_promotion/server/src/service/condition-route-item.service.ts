import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ConditionRouteItem } from '../domain/condition-route-item.entity';
import { ConditionRouteItemDTO } from '../service/dto/condition-route-item.dto';
import { ConditionRouteItemMapper } from '../service/mapper/condition-route-item.mapper';

const relations = {
  condition: true,
} as const;

@Injectable()
export class ConditionRouteItemService {
  logger = new Logger('ConditionRouteItemService');

  constructor(@InjectRepository(ConditionRouteItem) private conditionRouteItemRepository: Repository<ConditionRouteItem>) {}

  async findById(id: number): Promise<ConditionRouteItemDTO | undefined> {
    const result = await this.conditionRouteItemRepository.findOne({
      relations,
      where: { id },
    });
    return ConditionRouteItemMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ConditionRouteItemDTO>): Promise<ConditionRouteItemDTO | undefined> {
    const result = await this.conditionRouteItemRepository.findOne(options);
    return ConditionRouteItemMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ConditionRouteItemDTO>): Promise<[ConditionRouteItemDTO[], number]> {
    const resultList = await this.conditionRouteItemRepository.findAndCount({ ...options, relations });
    const conditionRouteItemDTO: ConditionRouteItemDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(conditionRouteItem => conditionRouteItemDTO.push(ConditionRouteItemMapper.fromEntityToDTO(conditionRouteItem)));
      resultList[0] = conditionRouteItemDTO;
    }
    return resultList;
  }

  async save(conditionRouteItemDTO: ConditionRouteItemDTO, creator?: string): Promise<ConditionRouteItemDTO | undefined> {
    const entity = ConditionRouteItemMapper.fromDTOtoEntity(conditionRouteItemDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.conditionRouteItemRepository.save(entity);
    return ConditionRouteItemMapper.fromEntityToDTO(result);
  }

  async update(conditionRouteItemDTO: ConditionRouteItemDTO, updater?: string): Promise<ConditionRouteItemDTO | undefined> {
    const entity = ConditionRouteItemMapper.fromDTOtoEntity(conditionRouteItemDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.conditionRouteItemRepository.save(entity);
    return ConditionRouteItemMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.conditionRouteItemRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
