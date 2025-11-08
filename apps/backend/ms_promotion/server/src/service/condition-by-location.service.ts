import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ConditionByLocation } from '../domain/condition-by-location.entity';
import { ConditionByLocationDTO } from '../service/dto/condition-by-location.dto';
import { ConditionByLocationMapper } from '../service/mapper/condition-by-location.mapper';

const relations = {
  promotion: true,
} as const;

@Injectable()
export class ConditionByLocationService {
  logger = new Logger('ConditionByLocationService');

  constructor(@InjectRepository(ConditionByLocation) private conditionByLocationRepository: Repository<ConditionByLocation>) {}

  async findById(id: number): Promise<ConditionByLocationDTO | undefined> {
    const result = await this.conditionByLocationRepository.findOne({
      relations,
      where: { id },
    });
    return ConditionByLocationMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ConditionByLocationDTO>): Promise<ConditionByLocationDTO | undefined> {
    const result = await this.conditionByLocationRepository.findOne(options);
    return ConditionByLocationMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ConditionByLocationDTO>): Promise<[ConditionByLocationDTO[], number]> {
    const resultList = await this.conditionByLocationRepository.findAndCount({ ...options, relations });
    const conditionByLocationDTO: ConditionByLocationDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(conditionByLocation =>
        conditionByLocationDTO.push(ConditionByLocationMapper.fromEntityToDTO(conditionByLocation)),
      );
      resultList[0] = conditionByLocationDTO;
    }
    return resultList;
  }

  async save(conditionByLocationDTO: ConditionByLocationDTO, creator?: string): Promise<ConditionByLocationDTO | undefined> {
    const entity = ConditionByLocationMapper.fromDTOtoEntity(conditionByLocationDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.conditionByLocationRepository.save(entity);
    return ConditionByLocationMapper.fromEntityToDTO(result);
  }

  async update(conditionByLocationDTO: ConditionByLocationDTO, updater?: string): Promise<ConditionByLocationDTO | undefined> {
    const entity = ConditionByLocationMapper.fromDTOtoEntity(conditionByLocationDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.conditionByLocationRepository.save(entity);
    return ConditionByLocationMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.conditionByLocationRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
