import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ConditionLocationItem } from '../domain/condition-location-item.entity';
import { ConditionLocationItemDTO } from '../service/dto/condition-location-item.dto';
import { ConditionLocationItemMapper } from '../service/mapper/condition-location-item.mapper';

const relations = {
  condition: true,
} as const;

@Injectable()
export class ConditionLocationItemService {
  logger = new Logger('ConditionLocationItemService');

  constructor(@InjectRepository(ConditionLocationItem) private conditionLocationItemRepository: Repository<ConditionLocationItem>) {}

  async findById(id: number): Promise<ConditionLocationItemDTO | undefined> {
    const result = await this.conditionLocationItemRepository.findOne({
      relations,
      where: { id },
    });
    return ConditionLocationItemMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ConditionLocationItemDTO>): Promise<ConditionLocationItemDTO | undefined> {
    const result = await this.conditionLocationItemRepository.findOne(options);
    return ConditionLocationItemMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ConditionLocationItemDTO>): Promise<[ConditionLocationItemDTO[], number]> {
    const resultList = await this.conditionLocationItemRepository.findAndCount({ ...options, relations });
    const conditionLocationItemDTO: ConditionLocationItemDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(conditionLocationItem =>
        conditionLocationItemDTO.push(ConditionLocationItemMapper.fromEntityToDTO(conditionLocationItem)),
      );
      resultList[0] = conditionLocationItemDTO;
    }
    return resultList;
  }

  async save(conditionLocationItemDTO: ConditionLocationItemDTO, creator?: string): Promise<ConditionLocationItemDTO | undefined> {
    const entity = ConditionLocationItemMapper.fromDTOtoEntity(conditionLocationItemDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.conditionLocationItemRepository.save(entity);
    return ConditionLocationItemMapper.fromEntityToDTO(result);
  }

  async update(conditionLocationItemDTO: ConditionLocationItemDTO, updater?: string): Promise<ConditionLocationItemDTO | undefined> {
    const entity = ConditionLocationItemMapper.fromDTOtoEntity(conditionLocationItemDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.conditionLocationItemRepository.save(entity);
    return ConditionLocationItemMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.conditionLocationItemRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
