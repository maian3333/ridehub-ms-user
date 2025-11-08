import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { PercentOffTotal } from '../domain/percent-off-total.entity';
import { PercentOffTotalDTO } from '../service/dto/percent-off-total.dto';
import { PercentOffTotalMapper } from '../service/mapper/percent-off-total.mapper';

const relations = {
  promotion: true,
} as const;

@Injectable()
export class PercentOffTotalService {
  logger = new Logger('PercentOffTotalService');

  constructor(@InjectRepository(PercentOffTotal) private percentOffTotalRepository: Repository<PercentOffTotal>) {}

  async findById(id: number): Promise<PercentOffTotalDTO | undefined> {
    const result = await this.percentOffTotalRepository.findOne({
      relations,
      where: { id },
    });
    return PercentOffTotalMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<PercentOffTotalDTO>): Promise<PercentOffTotalDTO | undefined> {
    const result = await this.percentOffTotalRepository.findOne(options);
    return PercentOffTotalMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<PercentOffTotalDTO>): Promise<[PercentOffTotalDTO[], number]> {
    const resultList = await this.percentOffTotalRepository.findAndCount({ ...options, relations });
    const percentOffTotalDTO: PercentOffTotalDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(percentOffTotal => percentOffTotalDTO.push(PercentOffTotalMapper.fromEntityToDTO(percentOffTotal)));
      resultList[0] = percentOffTotalDTO;
    }
    return resultList;
  }

  async save(percentOffTotalDTO: PercentOffTotalDTO, creator?: string): Promise<PercentOffTotalDTO | undefined> {
    const entity = PercentOffTotalMapper.fromDTOtoEntity(percentOffTotalDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.percentOffTotalRepository.save(entity);
    return PercentOffTotalMapper.fromEntityToDTO(result);
  }

  async update(percentOffTotalDTO: PercentOffTotalDTO, updater?: string): Promise<PercentOffTotalDTO | undefined> {
    const entity = PercentOffTotalMapper.fromDTOtoEntity(percentOffTotalDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.percentOffTotalRepository.save(entity);
    return PercentOffTotalMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.percentOffTotalRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
