import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AppliedPromotion } from '../domain/applied-promotion.entity';
import { AppliedPromotionDTO } from '../service/dto/applied-promotion.dto';
import { AppliedPromotionMapper } from '../service/mapper/applied-promotion.mapper';

const relations = {
  booking: true,
} as const;

@Injectable()
export class AppliedPromotionService {
  logger = new Logger('AppliedPromotionService');

  constructor(@InjectRepository(AppliedPromotion) private appliedPromotionRepository: Repository<AppliedPromotion>) {}

  async findById(id: number): Promise<AppliedPromotionDTO | undefined> {
    const result = await this.appliedPromotionRepository.findOne({
      relations,
      where: { id },
    });
    return AppliedPromotionMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<AppliedPromotionDTO>): Promise<AppliedPromotionDTO | undefined> {
    const result = await this.appliedPromotionRepository.findOne(options);
    return AppliedPromotionMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<AppliedPromotionDTO>): Promise<[AppliedPromotionDTO[], number]> {
    const resultList = await this.appliedPromotionRepository.findAndCount({ ...options, relations });
    const appliedPromotionDTO: AppliedPromotionDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(appliedPromotion => appliedPromotionDTO.push(AppliedPromotionMapper.fromEntityToDTO(appliedPromotion)));
      resultList[0] = appliedPromotionDTO;
    }
    return resultList;
  }

  async save(appliedPromotionDTO: AppliedPromotionDTO, creator?: string): Promise<AppliedPromotionDTO | undefined> {
    const entity = AppliedPromotionMapper.fromDTOtoEntity(appliedPromotionDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.appliedPromotionRepository.save(entity);
    return AppliedPromotionMapper.fromEntityToDTO(result);
  }

  async update(appliedPromotionDTO: AppliedPromotionDTO, updater?: string): Promise<AppliedPromotionDTO | undefined> {
    const entity = AppliedPromotionMapper.fromDTOtoEntity(appliedPromotionDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.appliedPromotionRepository.save(entity);
    return AppliedPromotionMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.appliedPromotionRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
