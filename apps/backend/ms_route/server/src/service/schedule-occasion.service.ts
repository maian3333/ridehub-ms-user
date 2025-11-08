import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ScheduleOccasion } from '../domain/schedule-occasion.entity';
import { ScheduleOccasionDTO } from '../service/dto/schedule-occasion.dto';
import { ScheduleOccasionMapper } from '../service/mapper/schedule-occasion.mapper';

@Injectable()
export class ScheduleOccasionService {
  logger = new Logger('ScheduleOccasionService');

  constructor(@InjectRepository(ScheduleOccasion) private scheduleOccasionRepository: Repository<ScheduleOccasion>) {}

  async findById(id: number): Promise<ScheduleOccasionDTO | undefined> {
    const result = await this.scheduleOccasionRepository.findOne({
      where: { id },
    });
    return ScheduleOccasionMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ScheduleOccasionDTO>): Promise<ScheduleOccasionDTO | undefined> {
    const result = await this.scheduleOccasionRepository.findOne(options);
    return ScheduleOccasionMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ScheduleOccasionDTO>): Promise<[ScheduleOccasionDTO[], number]> {
    const resultList = await this.scheduleOccasionRepository.findAndCount(options);
    const scheduleOccasionDTO: ScheduleOccasionDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(scheduleOccasion => scheduleOccasionDTO.push(ScheduleOccasionMapper.fromEntityToDTO(scheduleOccasion)));
      resultList[0] = scheduleOccasionDTO;
    }
    return resultList;
  }

  async save(scheduleOccasionDTO: ScheduleOccasionDTO, creator?: string): Promise<ScheduleOccasionDTO | undefined> {
    const entity = ScheduleOccasionMapper.fromDTOtoEntity(scheduleOccasionDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.scheduleOccasionRepository.save(entity);
    return ScheduleOccasionMapper.fromEntityToDTO(result);
  }

  async update(scheduleOccasionDTO: ScheduleOccasionDTO, updater?: string): Promise<ScheduleOccasionDTO | undefined> {
    const entity = ScheduleOccasionMapper.fromDTOtoEntity(scheduleOccasionDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.scheduleOccasionRepository.save(entity);
    return ScheduleOccasionMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.scheduleOccasionRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
