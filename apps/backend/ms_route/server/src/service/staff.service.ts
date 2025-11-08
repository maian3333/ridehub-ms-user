import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Staff } from '../domain/staff.entity';
import { StaffDTO } from '../service/dto/staff.dto';
import { StaffMapper } from '../service/mapper/staff.mapper';

@Injectable()
export class StaffService {
  logger = new Logger('StaffService');

  constructor(@InjectRepository(Staff) private staffRepository: Repository<Staff>) {}

  async findById(id: number): Promise<StaffDTO | undefined> {
    const result = await this.staffRepository.findOne({
      where: { id },
    });
    return StaffMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<StaffDTO>): Promise<StaffDTO | undefined> {
    const result = await this.staffRepository.findOne(options);
    return StaffMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<StaffDTO>): Promise<[StaffDTO[], number]> {
    const resultList = await this.staffRepository.findAndCount(options);
    const staffDTO: StaffDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(staff => staffDTO.push(StaffMapper.fromEntityToDTO(staff)));
      resultList[0] = staffDTO;
    }
    return resultList;
  }

  async save(staffDTO: StaffDTO, creator?: string): Promise<StaffDTO | undefined> {
    const entity = StaffMapper.fromDTOtoEntity(staffDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.staffRepository.save(entity);
    return StaffMapper.fromEntityToDTO(result);
  }

  async update(staffDTO: StaffDTO, updater?: string): Promise<StaffDTO | undefined> {
    const entity = StaffMapper.fromDTOtoEntity(staffDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.staffRepository.save(entity);
    return StaffMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.staffRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
