import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FileBooking } from '../domain/file-booking.entity';
import { FileBookingDTO } from '../service/dto/file-booking.dto';
import { FileBookingMapper } from '../service/mapper/file-booking.mapper';

@Injectable()
export class FileBookingService {
  logger = new Logger('FileBookingService');

  constructor(@InjectRepository(FileBooking) private fileBookingRepository: Repository<FileBooking>) {}

  async findById(id: number): Promise<FileBookingDTO | undefined> {
    const result = await this.fileBookingRepository.findOne({
      where: { id },
    });
    return FileBookingMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<FileBookingDTO>): Promise<FileBookingDTO | undefined> {
    const result = await this.fileBookingRepository.findOne(options);
    return FileBookingMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<FileBookingDTO>): Promise<[FileBookingDTO[], number]> {
    const resultList = await this.fileBookingRepository.findAndCount(options);
    const fileBookingDTO: FileBookingDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(fileBooking => fileBookingDTO.push(FileBookingMapper.fromEntityToDTO(fileBooking)));
      resultList[0] = fileBookingDTO;
    }
    return resultList;
  }

  async save(fileBookingDTO: FileBookingDTO, creator?: string): Promise<FileBookingDTO | undefined> {
    const entity = FileBookingMapper.fromDTOtoEntity(fileBookingDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.fileBookingRepository.save(entity);
    return FileBookingMapper.fromEntityToDTO(result);
  }

  async update(fileBookingDTO: FileBookingDTO, updater?: string): Promise<FileBookingDTO | undefined> {
    const entity = FileBookingMapper.fromDTOtoEntity(fileBookingDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.fileBookingRepository.save(entity);
    return FileBookingMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.fileBookingRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
