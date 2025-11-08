import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Seat } from '../domain/seat.entity';
import { SeatDTO } from '../service/dto/seat.dto';
import { SeatMapper } from '../service/mapper/seat.mapper';

const relations = {
  floor: true,
} as const;

@Injectable()
export class SeatService {
  logger = new Logger('SeatService');

  constructor(@InjectRepository(Seat) private seatRepository: Repository<Seat>) {}

  async findById(id: number): Promise<SeatDTO | undefined> {
    const result = await this.seatRepository.findOne({
      relations,
      where: { id },
    });
    return SeatMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<SeatDTO>): Promise<SeatDTO | undefined> {
    const result = await this.seatRepository.findOne(options);
    return SeatMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<SeatDTO>): Promise<[SeatDTO[], number]> {
    const resultList = await this.seatRepository.findAndCount({ ...options, relations });
    const seatDTO: SeatDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(seat => seatDTO.push(SeatMapper.fromEntityToDTO(seat)));
      resultList[0] = seatDTO;
    }
    return resultList;
  }

  async save(seatDTO: SeatDTO, creator?: string): Promise<SeatDTO | undefined> {
    const entity = SeatMapper.fromDTOtoEntity(seatDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.seatRepository.save(entity);
    return SeatMapper.fromEntityToDTO(result);
  }

  async update(seatDTO: SeatDTO, updater?: string): Promise<SeatDTO | undefined> {
    const entity = SeatMapper.fromDTOtoEntity(seatDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.seatRepository.save(entity);
    return SeatMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.seatRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
