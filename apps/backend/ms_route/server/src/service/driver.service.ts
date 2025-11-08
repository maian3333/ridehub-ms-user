import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Driver } from '../domain/driver.entity';
import { DriverDTO } from '../service/dto/driver.dto';
import { DriverMapper } from '../service/mapper/driver.mapper';

const relations = {
  staff: true,
} as const;

@Injectable()
export class DriverService {
  logger = new Logger('DriverService');

  constructor(@InjectRepository(Driver) private driverRepository: Repository<Driver>) {}

  async findById(id: number): Promise<DriverDTO | undefined> {
    const result = await this.driverRepository.findOne({
      relations,
      where: { id },
    });
    return DriverMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<DriverDTO>): Promise<DriverDTO | undefined> {
    const result = await this.driverRepository.findOne(options);
    return DriverMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<DriverDTO>): Promise<[DriverDTO[], number]> {
    const resultList = await this.driverRepository.findAndCount({ ...options, relations });
    const driverDTO: DriverDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(driver => driverDTO.push(DriverMapper.fromEntityToDTO(driver)));
      resultList[0] = driverDTO;
    }
    return resultList;
  }

  async save(driverDTO: DriverDTO, creator?: string): Promise<DriverDTO | undefined> {
    const entity = DriverMapper.fromDTOtoEntity(driverDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.driverRepository.save(entity);
    return DriverMapper.fromEntityToDTO(result);
  }

  async update(driverDTO: DriverDTO, updater?: string): Promise<DriverDTO | undefined> {
    const entity = DriverMapper.fromDTOtoEntity(driverDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.driverRepository.save(entity);
    return DriverMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.driverRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
