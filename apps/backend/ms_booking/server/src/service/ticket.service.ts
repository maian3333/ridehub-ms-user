import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Ticket } from '../domain/ticket.entity';
import { TicketDTO } from '../service/dto/ticket.dto';
import { TicketMapper } from '../service/mapper/ticket.mapper';

const relations = {
  qrCodeImg: true,
  originalTicket: true,
  exchangedTicket: true,
  booking: true,
} as const;

@Injectable()
export class TicketService {
  logger = new Logger('TicketService');

  constructor(@InjectRepository(Ticket) private ticketRepository: Repository<Ticket>) {}

  async findById(id: number): Promise<TicketDTO | undefined> {
    const result = await this.ticketRepository.findOne({
      relations,
      where: { id },
    });
    return TicketMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<TicketDTO>): Promise<TicketDTO | undefined> {
    const result = await this.ticketRepository.findOne(options);
    return TicketMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<TicketDTO>): Promise<[TicketDTO[], number]> {
    const resultList = await this.ticketRepository.findAndCount({ ...options, relations });
    const ticketDTO: TicketDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(ticket => ticketDTO.push(TicketMapper.fromEntityToDTO(ticket)));
      resultList[0] = ticketDTO;
    }
    return resultList;
  }

  async save(ticketDTO: TicketDTO, creator?: string): Promise<TicketDTO | undefined> {
    const entity = TicketMapper.fromDTOtoEntity(ticketDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.ticketRepository.save(entity);
    return TicketMapper.fromEntityToDTO(result);
  }

  async update(ticketDTO: TicketDTO, updater?: string): Promise<TicketDTO | undefined> {
    const entity = TicketMapper.fromDTOtoEntity(ticketDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.ticketRepository.save(entity);
    return TicketMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.ticketRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
