import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { BuyNGetMFree } from '../domain/buy-n-get-m-free.entity';
import { BuyNGetMFreeDTO } from '../service/dto/buy-n-get-m-free.dto';
import { BuyNGetMFreeMapper } from '../service/mapper/buy-n-get-m-free.mapper';

const relations = {
  promotion: true,
} as const;

@Injectable()
export class BuyNGetMFreeService {
  logger = new Logger('BuyNGetMFreeService');

  constructor(@InjectRepository(BuyNGetMFree) private buyNGetMFreeRepository: Repository<BuyNGetMFree>) {}

  async findById(id: number): Promise<BuyNGetMFreeDTO | undefined> {
    const result = await this.buyNGetMFreeRepository.findOne({
      relations,
      where: { id },
    });
    return BuyNGetMFreeMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<BuyNGetMFreeDTO>): Promise<BuyNGetMFreeDTO | undefined> {
    const result = await this.buyNGetMFreeRepository.findOne(options);
    return BuyNGetMFreeMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<BuyNGetMFreeDTO>): Promise<[BuyNGetMFreeDTO[], number]> {
    const resultList = await this.buyNGetMFreeRepository.findAndCount({ ...options, relations });
    const buyNGetMFreeDTO: BuyNGetMFreeDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(buyNGetMFree => buyNGetMFreeDTO.push(BuyNGetMFreeMapper.fromEntityToDTO(buyNGetMFree)));
      resultList[0] = buyNGetMFreeDTO;
    }
    return resultList;
  }

  async save(buyNGetMFreeDTO: BuyNGetMFreeDTO, creator?: string): Promise<BuyNGetMFreeDTO | undefined> {
    const entity = BuyNGetMFreeMapper.fromDTOtoEntity(buyNGetMFreeDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.buyNGetMFreeRepository.save(entity);
    return BuyNGetMFreeMapper.fromEntityToDTO(result);
  }

  async update(buyNGetMFreeDTO: BuyNGetMFreeDTO, updater?: string): Promise<BuyNGetMFreeDTO | undefined> {
    const entity = BuyNGetMFreeMapper.fromDTOtoEntity(buyNGetMFreeDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.buyNGetMFreeRepository.save(entity);
    return BuyNGetMFreeMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.buyNGetMFreeRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
