import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { PaymentWebhookLog } from '../domain/payment-webhook-log.entity';
import { PaymentWebhookLogDTO } from '../service/dto/payment-webhook-log.dto';
import { PaymentWebhookLogMapper } from '../service/mapper/payment-webhook-log.mapper';

const relations = {
  paymentTransaction: true,
} as const;

@Injectable()
export class PaymentWebhookLogService {
  logger = new Logger('PaymentWebhookLogService');

  constructor(@InjectRepository(PaymentWebhookLog) private paymentWebhookLogRepository: Repository<PaymentWebhookLog>) {}

  async findById(id: number): Promise<PaymentWebhookLogDTO | undefined> {
    const result = await this.paymentWebhookLogRepository.findOne({
      relations,
      where: { id },
    });
    return PaymentWebhookLogMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<PaymentWebhookLogDTO>): Promise<PaymentWebhookLogDTO | undefined> {
    const result = await this.paymentWebhookLogRepository.findOne(options);
    return PaymentWebhookLogMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<PaymentWebhookLogDTO>): Promise<[PaymentWebhookLogDTO[], number]> {
    const resultList = await this.paymentWebhookLogRepository.findAndCount({ ...options, relations });
    const paymentWebhookLogDTO: PaymentWebhookLogDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(paymentWebhookLog => paymentWebhookLogDTO.push(PaymentWebhookLogMapper.fromEntityToDTO(paymentWebhookLog)));
      resultList[0] = paymentWebhookLogDTO;
    }
    return resultList;
  }

  async save(paymentWebhookLogDTO: PaymentWebhookLogDTO, creator?: string): Promise<PaymentWebhookLogDTO | undefined> {
    const entity = PaymentWebhookLogMapper.fromDTOtoEntity(paymentWebhookLogDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.paymentWebhookLogRepository.save(entity);
    return PaymentWebhookLogMapper.fromEntityToDTO(result);
  }

  async update(paymentWebhookLogDTO: PaymentWebhookLogDTO, updater?: string): Promise<PaymentWebhookLogDTO | undefined> {
    const entity = PaymentWebhookLogMapper.fromDTOtoEntity(paymentWebhookLogDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.paymentWebhookLogRepository.save(entity);
    return PaymentWebhookLogMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.paymentWebhookLogRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
