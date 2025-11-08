import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FileUser } from '../domain/file-user.entity';
import { FileUserDTO } from '../service/dto/file-user.dto';
import { FileUserMapper } from '../service/mapper/file-user.mapper';

@Injectable()
export class FileUserService {
  logger = new Logger('FileUserService');

  constructor(@InjectRepository(FileUser) private fileUserRepository: Repository<FileUser>) {}

  async findById(id: number): Promise<FileUserDTO | undefined> {
    const result = await this.fileUserRepository.findOne({
      where: { id },
    });
    return FileUserMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<FileUserDTO>): Promise<FileUserDTO | undefined> {
    const result = await this.fileUserRepository.findOne(options);
    return FileUserMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<FileUserDTO>): Promise<[FileUserDTO[], number]> {
    const resultList = await this.fileUserRepository.findAndCount(options);
    const fileUserDTO: FileUserDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(fileUser => fileUserDTO.push(FileUserMapper.fromEntityToDTO(fileUser)));
      resultList[0] = fileUserDTO;
    }
    return resultList;
  }

  async save(fileUserDTO: FileUserDTO, creator?: string): Promise<FileUserDTO | undefined> {
    const entity = FileUserMapper.fromDTOtoEntity(fileUserDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.fileUserRepository.save(entity);
    return FileUserMapper.fromEntityToDTO(result);
  }

  async update(fileUserDTO: FileUserDTO, updater?: string): Promise<FileUserDTO | undefined> {
    const entity = FileUserMapper.fromDTOtoEntity(fileUserDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.fileUserRepository.save(entity);
    return FileUserMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.fileUserRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
