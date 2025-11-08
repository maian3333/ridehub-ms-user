import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Ward } from '../domain/ward.entity';
import { WardDTO } from '../service/dto/ward.dto';
import { WardMapper } from '../service/mapper/ward.mapper';

const relations = {
  district: true,
} as const;

@Injectable()
export class WardService {
  logger = new Logger('WardService');

  constructor(@InjectRepository(Ward) private wardRepository: Repository<Ward>) {}

  async findById(id: number): Promise<WardDTO | undefined> {
    const result = await this.wardRepository.findOne({
      relations,
      where: { id },
    });
    return WardMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<WardDTO>): Promise<WardDTO | undefined> {
    const result = await this.wardRepository.findOne(options);
    return WardMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<WardDTO>): Promise<[WardDTO[], number]> {
    const resultList = await this.wardRepository.findAndCount({ ...options, relations });
    const wardDTO: WardDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(ward => wardDTO.push(WardMapper.fromEntityToDTO(ward)));
      resultList[0] = wardDTO;
    }
    return resultList;
  }

  async save(wardDTO: WardDTO, creator?: string): Promise<WardDTO | undefined> {
    const entity = WardMapper.fromDTOtoEntity(wardDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.wardRepository.save(entity);
    return WardMapper.fromEntityToDTO(result);
  }

  async update(wardDTO: WardDTO, updater?: string): Promise<WardDTO | undefined> {
    const entity = WardMapper.fromDTOtoEntity(wardDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.wardRepository.save(entity);
    return WardMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.wardRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
