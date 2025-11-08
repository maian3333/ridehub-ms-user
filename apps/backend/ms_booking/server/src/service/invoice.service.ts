import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Invoice } from '../domain/invoice.entity';
import { InvoiceDTO } from '../service/dto/invoice.dto';
import { InvoiceMapper } from '../service/mapper/invoice.mapper';

@Injectable()
export class InvoiceService {
  logger = new Logger('InvoiceService');

  constructor(@InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>) {}

  async findById(id: number): Promise<InvoiceDTO | undefined> {
    const result = await this.invoiceRepository.findOne({
      where: { id },
    });
    return InvoiceMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<InvoiceDTO>): Promise<InvoiceDTO | undefined> {
    const result = await this.invoiceRepository.findOne(options);
    return InvoiceMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<InvoiceDTO>): Promise<[InvoiceDTO[], number]> {
    const resultList = await this.invoiceRepository.findAndCount(options);
    const invoiceDTO: InvoiceDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(invoice => invoiceDTO.push(InvoiceMapper.fromEntityToDTO(invoice)));
      resultList[0] = invoiceDTO;
    }
    return resultList;
  }

  async save(invoiceDTO: InvoiceDTO, creator?: string): Promise<InvoiceDTO | undefined> {
    const entity = InvoiceMapper.fromDTOtoEntity(invoiceDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.invoiceRepository.save(entity);
    return InvoiceMapper.fromEntityToDTO(result);
  }

  async update(invoiceDTO: InvoiceDTO, updater?: string): Promise<InvoiceDTO | undefined> {
    const entity = InvoiceMapper.fromDTOtoEntity(invoiceDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.invoiceRepository.save(entity);
    return InvoiceMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.invoiceRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
