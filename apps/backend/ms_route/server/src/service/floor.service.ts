import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Floor } from '../domain/floor.entity';
import { FloorDTO } from '../service/dto/floor.dto';
import { FloorMapper } from '../service/mapper/floor.mapper';

const relations = {
  seatMap: true,
} as const;

@Injectable()
export class FloorService {
  logger = new Logger('FloorService');

  constructor(@InjectRepository(Floor) private floorRepository: Repository<Floor>) {}

  async findById(id: number): Promise<FloorDTO | undefined> {
    const result = await this.floorRepository.findOne({
      relations,
      where: { id },
    });
    return FloorMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<FloorDTO>): Promise<FloorDTO | undefined> {
    const result = await this.floorRepository.findOne(options);
    return FloorMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<FloorDTO>): Promise<[FloorDTO[], number]> {
    const resultList = await this.floorRepository.findAndCount({ ...options, relations });
    const floorDTO: FloorDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(floor => floorDTO.push(FloorMapper.fromEntityToDTO(floor)));
      resultList[0] = floorDTO;
    }
    return resultList;
  }

  async save(floorDTO: FloorDTO, creator?: string): Promise<FloorDTO | undefined> {
    const entity = FloorMapper.fromDTOtoEntity(floorDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.floorRepository.save(entity);
    return FloorMapper.fromEntityToDTO(result);
  }

  async update(floorDTO: FloorDTO, updater?: string): Promise<FloorDTO | undefined> {
    const entity = FloorMapper.fromDTOtoEntity(floorDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.floorRepository.save(entity);
    return FloorMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.floorRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
