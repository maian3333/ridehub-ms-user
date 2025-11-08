import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Attendant } from '../domain/attendant.entity';
import { AttendantDTO } from '../service/dto/attendant.dto';
import { AttendantMapper } from '../service/mapper/attendant.mapper';

const relations = {
  staff: true,
} as const;

@Injectable()
export class AttendantService {
  logger = new Logger('AttendantService');

  constructor(@InjectRepository(Attendant) private attendantRepository: Repository<Attendant>) {}

  async findById(id: number): Promise<AttendantDTO | undefined> {
    const result = await this.attendantRepository.findOne({
      relations,
      where: { id },
    });
    return AttendantMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<AttendantDTO>): Promise<AttendantDTO | undefined> {
    const result = await this.attendantRepository.findOne(options);
    return AttendantMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<AttendantDTO>): Promise<[AttendantDTO[], number]> {
    const resultList = await this.attendantRepository.findAndCount({ ...options, relations });
    const attendantDTO: AttendantDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(attendant => attendantDTO.push(AttendantMapper.fromEntityToDTO(attendant)));
      resultList[0] = attendantDTO;
    }
    return resultList;
  }

  async save(attendantDTO: AttendantDTO, creator?: string): Promise<AttendantDTO | undefined> {
    const entity = AttendantMapper.fromDTOtoEntity(attendantDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.attendantRepository.save(entity);
    return AttendantMapper.fromEntityToDTO(result);
  }

  async update(attendantDTO: AttendantDTO, updater?: string): Promise<AttendantDTO | undefined> {
    const entity = AttendantMapper.fromDTOtoEntity(attendantDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.attendantRepository.save(entity);
    return AttendantMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.attendantRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
