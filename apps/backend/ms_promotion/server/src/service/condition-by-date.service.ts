import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ConditionByDate } from '../domain/condition-by-date.entity';
import { ConditionByDateDTO } from '../service/dto/condition-by-date.dto';
import { ConditionByDateMapper } from '../service/mapper/condition-by-date.mapper';

const relations = {
  promotion: true,
} as const;

@Injectable()
export class ConditionByDateService {
  logger = new Logger('ConditionByDateService');

  constructor(@InjectRepository(ConditionByDate) private conditionByDateRepository: Repository<ConditionByDate>) {}

  async findById(id: number): Promise<ConditionByDateDTO | undefined> {
    const result = await this.conditionByDateRepository.findOne({
      relations,
      where: { id },
    });
    return ConditionByDateMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ConditionByDateDTO>): Promise<ConditionByDateDTO | undefined> {
    const result = await this.conditionByDateRepository.findOne(options);
    return ConditionByDateMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ConditionByDateDTO>): Promise<[ConditionByDateDTO[], number]> {
    const resultList = await this.conditionByDateRepository.findAndCount({ ...options, relations });
    const conditionByDateDTO: ConditionByDateDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(conditionByDate => conditionByDateDTO.push(ConditionByDateMapper.fromEntityToDTO(conditionByDate)));
      resultList[0] = conditionByDateDTO;
    }
    return resultList;
  }

  async save(conditionByDateDTO: ConditionByDateDTO, creator?: string): Promise<ConditionByDateDTO | undefined> {
    const entity = ConditionByDateMapper.fromDTOtoEntity(conditionByDateDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.conditionByDateRepository.save(entity);
    return ConditionByDateMapper.fromEntityToDTO(result);
  }

  async update(conditionByDateDTO: ConditionByDateDTO, updater?: string): Promise<ConditionByDateDTO | undefined> {
    const entity = ConditionByDateMapper.fromDTOtoEntity(conditionByDateDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.conditionByDateRepository.save(entity);
    return ConditionByDateMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.conditionByDateRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
