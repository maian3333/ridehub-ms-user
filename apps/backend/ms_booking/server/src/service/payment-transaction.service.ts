import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { PaymentTransaction } from '../domain/payment-transaction.entity';
import { PaymentTransactionDTO } from '../service/dto/payment-transaction.dto';
import { PaymentTransactionMapper } from '../service/mapper/payment-transaction.mapper';

@Injectable()
export class PaymentTransactionService {
  logger = new Logger('PaymentTransactionService');

  constructor(@InjectRepository(PaymentTransaction) private paymentTransactionRepository: Repository<PaymentTransaction>) {}

  async findById(id: number): Promise<PaymentTransactionDTO | undefined> {
    const result = await this.paymentTransactionRepository.findOne({
      where: { id },
    });
    return PaymentTransactionMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<PaymentTransactionDTO>): Promise<PaymentTransactionDTO | undefined> {
    const result = await this.paymentTransactionRepository.findOne(options);
    return PaymentTransactionMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<PaymentTransactionDTO>): Promise<[PaymentTransactionDTO[], number]> {
    const resultList = await this.paymentTransactionRepository.findAndCount(options);
    const paymentTransactionDTO: PaymentTransactionDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(paymentTransaction => paymentTransactionDTO.push(PaymentTransactionMapper.fromEntityToDTO(paymentTransaction)));
      resultList[0] = paymentTransactionDTO;
    }
    return resultList;
  }

  async save(paymentTransactionDTO: PaymentTransactionDTO, creator?: string): Promise<PaymentTransactionDTO | undefined> {
    const entity = PaymentTransactionMapper.fromDTOtoEntity(paymentTransactionDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.paymentTransactionRepository.save(entity);
    return PaymentTransactionMapper.fromEntityToDTO(result);
  }

  async update(paymentTransactionDTO: PaymentTransactionDTO, updater?: string): Promise<PaymentTransactionDTO | undefined> {
    const entity = PaymentTransactionMapper.fromDTOtoEntity(paymentTransactionDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.paymentTransactionRepository.save(entity);
    return PaymentTransactionMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.paymentTransactionRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
