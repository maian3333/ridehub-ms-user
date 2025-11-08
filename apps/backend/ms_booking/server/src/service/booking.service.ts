import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Booking } from '../domain/booking.entity';
import { BookingDTO } from '../service/dto/booking.dto';
import { BookingMapper } from '../service/mapper/booking.mapper';

const relations = {
  invoice: true,
  paymentTransaction: true,
} as const;

@Injectable()
export class BookingService {
  logger = new Logger('BookingService');

  constructor(@InjectRepository(Booking) private bookingRepository: Repository<Booking>) {}

  async findById(id: number): Promise<BookingDTO | undefined> {
    const result = await this.bookingRepository.findOne({
      relations,
      where: { id },
    });
    return BookingMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<BookingDTO>): Promise<BookingDTO | undefined> {
    const result = await this.bookingRepository.findOne(options);
    return BookingMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<BookingDTO>): Promise<[BookingDTO[], number]> {
    const resultList = await this.bookingRepository.findAndCount({ ...options, relations });
    const bookingDTO: BookingDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(booking => bookingDTO.push(BookingMapper.fromEntityToDTO(booking)));
      resultList[0] = bookingDTO;
    }
    return resultList;
  }

  async save(bookingDTO: BookingDTO, creator?: string): Promise<BookingDTO | undefined> {
    const entity = BookingMapper.fromDTOtoEntity(bookingDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.bookingRepository.save(entity);
    return BookingMapper.fromEntityToDTO(result);
  }

  async update(bookingDTO: BookingDTO, updater?: string): Promise<BookingDTO | undefined> {
    const entity = BookingMapper.fromDTOtoEntity(bookingDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.bookingRepository.save(entity);
    return BookingMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.bookingRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
