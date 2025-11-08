import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AppUser } from '../domain/app-user.entity';
import { AppUserDTO } from '../service/dto/app-user.dto';
import { AppUserMapper } from '../service/mapper/app-user.mapper';

const relations = {
  profile: true,
} as const;

@Injectable()
export class AppUserService {
  logger = new Logger('AppUserService');

  constructor(@InjectRepository(AppUser) private appUserRepository: Repository<AppUser>) {}

  async findById(id: number): Promise<AppUserDTO | undefined> {
    const result = await this.appUserRepository.findOne({
      relations,
      where: { id },
    });
    return AppUserMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<AppUserDTO>): Promise<AppUserDTO | undefined> {
    const result = await this.appUserRepository.findOne(options);
    return AppUserMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<AppUserDTO>): Promise<[AppUserDTO[], number]> {
    const resultList = await this.appUserRepository.findAndCount({ ...options, relations });
    const appUserDTO: AppUserDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(appUser => appUserDTO.push(AppUserMapper.fromEntityToDTO(appUser)));
      resultList[0] = appUserDTO;
    }
    return resultList;
  }

  async save(appUserDTO: AppUserDTO, creator?: string): Promise<AppUserDTO | undefined> {
    const entity = AppUserMapper.fromDTOtoEntity(appUserDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.appUserRepository.save(entity);
    return AppUserMapper.fromEntityToDTO(result);
  }

  async update(appUserDTO: AppUserDTO, updater?: string): Promise<AppUserDTO | undefined> {
    const entity = AppUserMapper.fromDTOtoEntity(appUserDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.appUserRepository.save(entity);
    return AppUserMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.appUserRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
