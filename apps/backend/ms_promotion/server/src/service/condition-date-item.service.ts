import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ConditionDateItem } from '../domain/condition-date-item.entity';
import { ConditionDateItemDTO } from '../service/dto/condition-date-item.dto';
import { ConditionDateItemMapper } from '../service/mapper/condition-date-item.mapper';

const relations = {
  condition: true,
} as const;

@Injectable()
export class ConditionDateItemService {
  logger = new Logger('ConditionDateItemService');

  constructor(@InjectRepository(ConditionDateItem) private conditionDateItemRepository: Repository<ConditionDateItem>) {}

  async findById(id: number): Promise<ConditionDateItemDTO | undefined> {
    const result = await this.conditionDateItemRepository.findOne({
      relations,
      where: { id },
    });
    return ConditionDateItemMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ConditionDateItemDTO>): Promise<ConditionDateItemDTO | undefined> {
    const result = await this.conditionDateItemRepository.findOne(options);
    return ConditionDateItemMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ConditionDateItemDTO>): Promise<[ConditionDateItemDTO[], number]> {
    const resultList = await this.conditionDateItemRepository.findAndCount({ ...options, relations });
    const conditionDateItemDTO: ConditionDateItemDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(conditionDateItem => conditionDateItemDTO.push(ConditionDateItemMapper.fromEntityToDTO(conditionDateItem)));
      resultList[0] = conditionDateItemDTO;
    }
    return resultList;
  }

  async save(conditionDateItemDTO: ConditionDateItemDTO, creator?: string): Promise<ConditionDateItemDTO | undefined> {
    const entity = ConditionDateItemMapper.fromDTOtoEntity(conditionDateItemDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.conditionDateItemRepository.save(entity);
    return ConditionDateItemMapper.fromEntityToDTO(result);
  }

  async update(conditionDateItemDTO: ConditionDateItemDTO, updater?: string): Promise<ConditionDateItemDTO | undefined> {
    const entity = ConditionDateItemMapper.fromDTOtoEntity(conditionDateItemDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.conditionDateItemRepository.save(entity);
    return ConditionDateItemMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.conditionDateItemRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
