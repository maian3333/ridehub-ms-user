import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FileRoute } from '../domain/file-route.entity';
import { FileRouteDTO } from '../service/dto/file-route.dto';
import { FileRouteMapper } from '../service/mapper/file-route.mapper';

@Injectable()
export class FileRouteService {
  logger = new Logger('FileRouteService');

  constructor(@InjectRepository(FileRoute) private fileRouteRepository: Repository<FileRoute>) {}

  async findById(id: number): Promise<FileRouteDTO | undefined> {
    const result = await this.fileRouteRepository.findOne({
      where: { id },
    });
    return FileRouteMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<FileRouteDTO>): Promise<FileRouteDTO | undefined> {
    const result = await this.fileRouteRepository.findOne(options);
    return FileRouteMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<FileRouteDTO>): Promise<[FileRouteDTO[], number]> {
    const resultList = await this.fileRouteRepository.findAndCount(options);
    const fileRouteDTO: FileRouteDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(fileRoute => fileRouteDTO.push(FileRouteMapper.fromEntityToDTO(fileRoute)));
      resultList[0] = fileRouteDTO;
    }
    return resultList;
  }

  async save(fileRouteDTO: FileRouteDTO, creator?: string): Promise<FileRouteDTO | undefined> {
    const entity = FileRouteMapper.fromDTOtoEntity(fileRouteDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.fileRouteRepository.save(entity);
    return FileRouteMapper.fromEntityToDTO(result);
  }

  async update(fileRouteDTO: FileRouteDTO, updater?: string): Promise<FileRouteDTO | undefined> {
    const entity = FileRouteMapper.fromDTOtoEntity(fileRouteDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.fileRouteRepository.save(entity);
    return FileRouteMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.fileRouteRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
