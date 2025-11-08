import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { District } from '../domain/district.entity';
import { DistrictDTO } from '../service/dto/district.dto';
import { DistrictMapper } from '../service/mapper/district.mapper';

const relations = {
  province: true,
} as const;

@Injectable()
export class DistrictService {
  logger = new Logger('DistrictService');

  constructor(@InjectRepository(District) private districtRepository: Repository<District>) {}

  async findById(id: number): Promise<DistrictDTO | undefined> {
    const result = await this.districtRepository.findOne({
      relations,
      where: { id },
    });
    return DistrictMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<DistrictDTO>): Promise<DistrictDTO | undefined> {
    const result = await this.districtRepository.findOne(options);
    return DistrictMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<DistrictDTO>): Promise<[DistrictDTO[], number]> {
    const resultList = await this.districtRepository.findAndCount({ ...options, relations });
    const districtDTO: DistrictDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(district => districtDTO.push(DistrictMapper.fromEntityToDTO(district)));
      resultList[0] = districtDTO;
    }
    return resultList;
  }

  async save(districtDTO: DistrictDTO, creator?: string): Promise<DistrictDTO | undefined> {
    const entity = DistrictMapper.fromDTOtoEntity(districtDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.districtRepository.save(entity);
    return DistrictMapper.fromEntityToDTO(result);
  }

  async update(districtDTO: DistrictDTO, updater?: string): Promise<DistrictDTO | undefined> {
    const entity = DistrictMapper.fromDTOtoEntity(districtDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.districtRepository.save(entity);
    return DistrictMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.districtRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
