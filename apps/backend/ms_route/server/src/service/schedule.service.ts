import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Schedule } from '../domain/schedule.entity';
import { ScheduleDTO } from '../service/dto/schedule.dto';
import { ScheduleMapper } from '../service/mapper/schedule.mapper';

const relations = {
  occasionRule: true,
  route: true,
} as const;

@Injectable()
export class ScheduleService {
  logger = new Logger('ScheduleService');

  constructor(@InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>) {}

  async findById(id: number): Promise<ScheduleDTO | undefined> {
    const result = await this.scheduleRepository.findOne({
      relations,
      where: { id },
    });
    return ScheduleMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ScheduleDTO>): Promise<ScheduleDTO | undefined> {
    const result = await this.scheduleRepository.findOne(options);
    return ScheduleMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ScheduleDTO>): Promise<[ScheduleDTO[], number]> {
    const resultList = await this.scheduleRepository.findAndCount({ ...options, relations });
    const scheduleDTO: ScheduleDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(schedule => scheduleDTO.push(ScheduleMapper.fromEntityToDTO(schedule)));
      resultList[0] = scheduleDTO;
    }
    return resultList;
  }

  async save(scheduleDTO: ScheduleDTO, creator?: string): Promise<ScheduleDTO | undefined> {
    const entity = ScheduleMapper.fromDTOtoEntity(scheduleDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.scheduleRepository.save(entity);
    return ScheduleMapper.fromEntityToDTO(result);
  }

  async update(scheduleDTO: ScheduleDTO, updater?: string): Promise<ScheduleDTO | undefined> {
    const entity = ScheduleMapper.fromDTOtoEntity(scheduleDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.scheduleRepository.save(entity);
    return ScheduleMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.scheduleRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
