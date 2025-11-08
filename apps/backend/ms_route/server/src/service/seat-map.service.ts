import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { SeatMap } from '../domain/seat-map.entity';
import { SeatMapDTO } from '../service/dto/seat-map.dto';
import { SeatMapMapper } from '../service/mapper/seat-map.mapper';

const relations = {
  seatMapImg: true,
} as const;

@Injectable()
export class SeatMapService {
  logger = new Logger('SeatMapService');

  constructor(@InjectRepository(SeatMap) private seatMapRepository: Repository<SeatMap>) {}

  async findById(id: number): Promise<SeatMapDTO | undefined> {
    const result = await this.seatMapRepository.findOne({
      relations,
      where: { id },
    });
    return SeatMapMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<SeatMapDTO>): Promise<SeatMapDTO | undefined> {
    const result = await this.seatMapRepository.findOne(options);
    return SeatMapMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<SeatMapDTO>): Promise<[SeatMapDTO[], number]> {
    const resultList = await this.seatMapRepository.findAndCount({ ...options, relations });
    const seatMapDTO: SeatMapDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(seatMap => seatMapDTO.push(SeatMapMapper.fromEntityToDTO(seatMap)));
      resultList[0] = seatMapDTO;
    }
    return resultList;
  }

  async save(seatMapDTO: SeatMapDTO, creator?: string): Promise<SeatMapDTO | undefined> {
    const entity = SeatMapMapper.fromDTOtoEntity(seatMapDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.seatMapRepository.save(entity);
    return SeatMapMapper.fromEntityToDTO(result);
  }

  async update(seatMapDTO: SeatMapDTO, updater?: string): Promise<SeatMapDTO | undefined> {
    const entity = SeatMapMapper.fromDTOtoEntity(seatMapDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.seatMapRepository.save(entity);
    return SeatMapMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.seatMapRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
