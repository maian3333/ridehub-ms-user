import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ConditionByRoute } from '../domain/condition-by-route.entity';
import { ConditionByRouteDTO } from '../service/dto/condition-by-route.dto';
import { ConditionByRouteMapper } from '../service/mapper/condition-by-route.mapper';

const relations = {
  promotion: true,
} as const;

@Injectable()
export class ConditionByRouteService {
  logger = new Logger('ConditionByRouteService');

  constructor(@InjectRepository(ConditionByRoute) private conditionByRouteRepository: Repository<ConditionByRoute>) {}

  async findById(id: number): Promise<ConditionByRouteDTO | undefined> {
    const result = await this.conditionByRouteRepository.findOne({
      relations,
      where: { id },
    });
    return ConditionByRouteMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ConditionByRouteDTO>): Promise<ConditionByRouteDTO | undefined> {
    const result = await this.conditionByRouteRepository.findOne(options);
    return ConditionByRouteMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ConditionByRouteDTO>): Promise<[ConditionByRouteDTO[], number]> {
    const resultList = await this.conditionByRouteRepository.findAndCount({ ...options, relations });
    const conditionByRouteDTO: ConditionByRouteDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(conditionByRoute => conditionByRouteDTO.push(ConditionByRouteMapper.fromEntityToDTO(conditionByRoute)));
      resultList[0] = conditionByRouteDTO;
    }
    return resultList;
  }

  async save(conditionByRouteDTO: ConditionByRouteDTO, creator?: string): Promise<ConditionByRouteDTO | undefined> {
    const entity = ConditionByRouteMapper.fromDTOtoEntity(conditionByRouteDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.conditionByRouteRepository.save(entity);
    return ConditionByRouteMapper.fromEntityToDTO(result);
  }

  async update(conditionByRouteDTO: ConditionByRouteDTO, updater?: string): Promise<ConditionByRouteDTO | undefined> {
    const entity = ConditionByRouteMapper.fromDTOtoEntity(conditionByRouteDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.conditionByRouteRepository.save(entity);
    return ConditionByRouteMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.conditionByRouteRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
