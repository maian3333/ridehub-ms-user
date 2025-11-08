import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Trip } from '../domain/trip.entity';
import { TripDTO } from '../service/dto/trip.dto';
import { TripMapper } from '../service/mapper/trip.mapper';

const relations = {
  route: true,
  vehicle: true,
  slot: true,
  driver: true,
  attendant: true,
} as const;

@Injectable()
export class TripService {
  logger = new Logger('TripService');

  constructor(@InjectRepository(Trip) private tripRepository: Repository<Trip>) {}

  async findById(id: number): Promise<TripDTO | undefined> {
    const result = await this.tripRepository.findOne({
      relations,
      where: { id },
    });
    return TripMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<TripDTO>): Promise<TripDTO | undefined> {
    const result = await this.tripRepository.findOne(options);
    return TripMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<TripDTO>): Promise<[TripDTO[], number]> {
    const resultList = await this.tripRepository.findAndCount({ ...options, relations });
    const tripDTO: TripDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(trip => tripDTO.push(TripMapper.fromEntityToDTO(trip)));
      resultList[0] = tripDTO;
    }
    return resultList;
  }

  async save(tripDTO: TripDTO, creator?: string): Promise<TripDTO | undefined> {
    const entity = TripMapper.fromDTOtoEntity(tripDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.tripRepository.save(entity);
    return TripMapper.fromEntityToDTO(result);
  }

  async update(tripDTO: TripDTO, updater?: string): Promise<TripDTO | undefined> {
    const entity = TripMapper.fromDTOtoEntity(tripDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.tripRepository.save(entity);
    return TripMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.tripRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
