import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FilePromotion } from '../domain/file-promotion.entity';
import { FilePromotionDTO } from '../service/dto/file-promotion.dto';
import { FilePromotionMapper } from '../service/mapper/file-promotion.mapper';

const relations = {
  promotion: true,
} as const;

@Injectable()
export class FilePromotionService {
  logger = new Logger('FilePromotionService');

  constructor(@InjectRepository(FilePromotion) private filePromotionRepository: Repository<FilePromotion>) {}

  async findById(id: number): Promise<FilePromotionDTO | undefined> {
    const result = await this.filePromotionRepository.findOne({
      relations,
      where: { id },
    });
    return FilePromotionMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<FilePromotionDTO>): Promise<FilePromotionDTO | undefined> {
    const result = await this.filePromotionRepository.findOne(options);
    return FilePromotionMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<FilePromotionDTO>): Promise<[FilePromotionDTO[], number]> {
    const resultList = await this.filePromotionRepository.findAndCount({ ...options, relations });
    const filePromotionDTO: FilePromotionDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(filePromotion => filePromotionDTO.push(FilePromotionMapper.fromEntityToDTO(filePromotion)));
      resultList[0] = filePromotionDTO;
    }
    return resultList;
  }

  async save(filePromotionDTO: FilePromotionDTO, creator?: string): Promise<FilePromotionDTO | undefined> {
    const entity = FilePromotionMapper.fromDTOtoEntity(filePromotionDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.filePromotionRepository.save(entity);
    return FilePromotionMapper.fromEntityToDTO(result);
  }

  async update(filePromotionDTO: FilePromotionDTO, updater?: string): Promise<FilePromotionDTO | undefined> {
    const entity = FilePromotionMapper.fromDTOtoEntity(filePromotionDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.filePromotionRepository.save(entity);
    return FilePromotionMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.filePromotionRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
