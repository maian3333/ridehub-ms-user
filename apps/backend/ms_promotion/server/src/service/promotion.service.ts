import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Promotion } from '../domain/promotion.entity';
import { PromotionDTO } from '../service/dto/promotion.dto';
import { PromotionMapper } from '../service/mapper/promotion.mapper';

@Injectable()
export class PromotionService {
  logger = new Logger('PromotionService');

  constructor(@InjectRepository(Promotion) private promotionRepository: Repository<Promotion>) {}

  async findById(id: number): Promise<PromotionDTO | undefined> {
    const result = await this.promotionRepository.findOne({
      where: { id },
    });
    return PromotionMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<PromotionDTO>): Promise<PromotionDTO | undefined> {
    const result = await this.promotionRepository.findOne(options);
    return PromotionMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<PromotionDTO>): Promise<[PromotionDTO[], number]> {
    const resultList = await this.promotionRepository.findAndCount(options);
    const promotionDTO: PromotionDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(promotion => promotionDTO.push(PromotionMapper.fromEntityToDTO(promotion)));
      resultList[0] = promotionDTO;
    }
    return resultList;
  }

  async save(promotionDTO: PromotionDTO, creator?: string): Promise<PromotionDTO | undefined> {
    const entity = PromotionMapper.fromDTOtoEntity(promotionDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.promotionRepository.save(entity);
    return PromotionMapper.fromEntityToDTO(result);
  }

  async update(promotionDTO: PromotionDTO, updater?: string): Promise<PromotionDTO | undefined> {
    const entity = PromotionMapper.fromDTOtoEntity(promotionDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.promotionRepository.save(entity);
    return PromotionMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.promotionRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
