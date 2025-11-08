import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { PricingSnapshot } from '../domain/pricing-snapshot.entity';
import { PricingSnapshotDTO } from '../service/dto/pricing-snapshot.dto';
import { PricingSnapshotMapper } from '../service/mapper/pricing-snapshot.mapper';

const relations = {
  booking: true,
} as const;

@Injectable()
export class PricingSnapshotService {
  logger = new Logger('PricingSnapshotService');

  constructor(@InjectRepository(PricingSnapshot) private pricingSnapshotRepository: Repository<PricingSnapshot>) {}

  async findById(id: number): Promise<PricingSnapshotDTO | undefined> {
    const result = await this.pricingSnapshotRepository.findOne({
      relations,
      where: { id },
    });
    return PricingSnapshotMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<PricingSnapshotDTO>): Promise<PricingSnapshotDTO | undefined> {
    const result = await this.pricingSnapshotRepository.findOne(options);
    return PricingSnapshotMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<PricingSnapshotDTO>): Promise<[PricingSnapshotDTO[], number]> {
    const resultList = await this.pricingSnapshotRepository.findAndCount({ ...options, relations });
    const pricingSnapshotDTO: PricingSnapshotDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(pricingSnapshot => pricingSnapshotDTO.push(PricingSnapshotMapper.fromEntityToDTO(pricingSnapshot)));
      resultList[0] = pricingSnapshotDTO;
    }
    return resultList;
  }

  async save(pricingSnapshotDTO: PricingSnapshotDTO, creator?: string): Promise<PricingSnapshotDTO | undefined> {
    const entity = PricingSnapshotMapper.fromDTOtoEntity(pricingSnapshotDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.pricingSnapshotRepository.save(entity);
    return PricingSnapshotMapper.fromEntityToDTO(result);
  }

  async update(pricingSnapshotDTO: PricingSnapshotDTO, updater?: string): Promise<PricingSnapshotDTO | undefined> {
    const entity = PricingSnapshotMapper.fromDTOtoEntity(pricingSnapshotDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.pricingSnapshotRepository.save(entity);
    return PricingSnapshotMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.pricingSnapshotRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
