import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Station } from '../domain/station.entity';
import { StationDTO } from '../service/dto/station.dto';
import { StationMapper } from '../service/mapper/station.mapper';

const relations = {
  address: true,
  stationImg: true,
} as const;

@Injectable()
export class StationService {
  logger = new Logger('StationService');

  constructor(@InjectRepository(Station) private stationRepository: Repository<Station>) {}

  async findById(id: number): Promise<StationDTO | undefined> {
    const result = await this.stationRepository.findOne({
      relations,
      where: { id },
    });
    return StationMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<StationDTO>): Promise<StationDTO | undefined> {
    const result = await this.stationRepository.findOne(options);
    return StationMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<StationDTO>): Promise<[StationDTO[], number]> {
    const resultList = await this.stationRepository.findAndCount({ ...options, relations });
    const stationDTO: StationDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(station => stationDTO.push(StationMapper.fromEntityToDTO(station)));
      resultList[0] = stationDTO;
    }
    return resultList;
  }

  async save(stationDTO: StationDTO, creator?: string): Promise<StationDTO | undefined> {
    const entity = StationMapper.fromDTOtoEntity(stationDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.stationRepository.save(entity);
    return StationMapper.fromEntityToDTO(result);
  }

  async update(stationDTO: StationDTO, updater?: string): Promise<StationDTO | undefined> {
    const entity = StationMapper.fromDTOtoEntity(stationDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.stationRepository.save(entity);
    return StationMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.stationRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
