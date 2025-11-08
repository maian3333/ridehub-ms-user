import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ScheduleTimeSlot } from '../domain/schedule-time-slot.entity';
import { ScheduleTimeSlotDTO } from '../service/dto/schedule-time-slot.dto';
import { ScheduleTimeSlotMapper } from '../service/mapper/schedule-time-slot.mapper';

const relations = {
  schedule: true,
} as const;

@Injectable()
export class ScheduleTimeSlotService {
  logger = new Logger('ScheduleTimeSlotService');

  constructor(@InjectRepository(ScheduleTimeSlot) private scheduleTimeSlotRepository: Repository<ScheduleTimeSlot>) {}

  async findById(id: number): Promise<ScheduleTimeSlotDTO | undefined> {
    const result = await this.scheduleTimeSlotRepository.findOne({
      relations,
      where: { id },
    });
    return ScheduleTimeSlotMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ScheduleTimeSlotDTO>): Promise<ScheduleTimeSlotDTO | undefined> {
    const result = await this.scheduleTimeSlotRepository.findOne(options);
    return ScheduleTimeSlotMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ScheduleTimeSlotDTO>): Promise<[ScheduleTimeSlotDTO[], number]> {
    const resultList = await this.scheduleTimeSlotRepository.findAndCount({ ...options, relations });
    const scheduleTimeSlotDTO: ScheduleTimeSlotDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(scheduleTimeSlot => scheduleTimeSlotDTO.push(ScheduleTimeSlotMapper.fromEntityToDTO(scheduleTimeSlot)));
      resultList[0] = scheduleTimeSlotDTO;
    }
    return resultList;
  }

  async save(scheduleTimeSlotDTO: ScheduleTimeSlotDTO, creator?: string): Promise<ScheduleTimeSlotDTO | undefined> {
    const entity = ScheduleTimeSlotMapper.fromDTOtoEntity(scheduleTimeSlotDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.scheduleTimeSlotRepository.save(entity);
    return ScheduleTimeSlotMapper.fromEntityToDTO(result);
  }

  async update(scheduleTimeSlotDTO: ScheduleTimeSlotDTO, updater?: string): Promise<ScheduleTimeSlotDTO | undefined> {
    const entity = ScheduleTimeSlotMapper.fromDTOtoEntity(scheduleTimeSlotDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.scheduleTimeSlotRepository.save(entity);
    return ScheduleTimeSlotMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.scheduleTimeSlotRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
