import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { SeatLock } from '../domain/seat-lock.entity';
import { SeatLockDTO } from '../service/dto/seat-lock.dto';
import { SeatLockMapper } from '../service/mapper/seat-lock.mapper';

const relations = {
  trip: true,
} as const;

@Injectable()
export class SeatLockService {
  logger = new Logger('SeatLockService');

  constructor(@InjectRepository(SeatLock) private seatLockRepository: Repository<SeatLock>) {}

  async findById(id: number): Promise<SeatLockDTO | undefined> {
    const result = await this.seatLockRepository.findOne({
      relations,
      where: { id },
    });
    return SeatLockMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<SeatLockDTO>): Promise<SeatLockDTO | undefined> {
    const result = await this.seatLockRepository.findOne(options);
    return SeatLockMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<SeatLockDTO>): Promise<[SeatLockDTO[], number]> {
    const resultList = await this.seatLockRepository.findAndCount({ ...options, relations });
    const seatLockDTO: SeatLockDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(seatLock => seatLockDTO.push(SeatLockMapper.fromEntityToDTO(seatLock)));
      resultList[0] = seatLockDTO;
    }
    return resultList;
  }

  async save(seatLockDTO: SeatLockDTO, creator?: string): Promise<SeatLockDTO | undefined> {
    const entity = SeatLockMapper.fromDTOtoEntity(seatLockDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.seatLockRepository.save(entity);
    return SeatLockMapper.fromEntityToDTO(result);
  }

  async update(seatLockDTO: SeatLockDTO, updater?: string): Promise<SeatLockDTO | undefined> {
    const entity = SeatLockMapper.fromDTOtoEntity(seatLockDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.seatLockRepository.save(entity);
    return SeatLockMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.seatLockRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
