import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Profile } from '../domain/profile.entity';
import { ProfileDTO } from '../service/dto/profile.dto';
import { ProfileMapper } from '../service/mapper/profile.mapper';

const relations = {
  avatar: true,
} as const;

@Injectable()
export class ProfileService {
  logger = new Logger('ProfileService');

  constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) {}

  async findById(id: number): Promise<ProfileDTO | undefined> {
    const result = await this.profileRepository.findOne({
      relations,
      where: { id },
    });
    return ProfileMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ProfileDTO>): Promise<ProfileDTO | undefined> {
    const result = await this.profileRepository.findOne(options);
    return ProfileMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ProfileDTO>): Promise<[ProfileDTO[], number]> {
    const resultList = await this.profileRepository.findAndCount({ ...options, relations });
    const profileDTO: ProfileDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(profile => profileDTO.push(ProfileMapper.fromEntityToDTO(profile)));
      resultList[0] = profileDTO;
    }
    return resultList;
  }

  async save(profileDTO: ProfileDTO, creator?: string): Promise<ProfileDTO | undefined> {
    const entity = ProfileMapper.fromDTOtoEntity(profileDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.profileRepository.save(entity);
    return ProfileMapper.fromEntityToDTO(result);
  }

  async update(profileDTO: ProfileDTO, updater?: string): Promise<ProfileDTO | undefined> {
    const entity = ProfileMapper.fromDTOtoEntity(profileDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.profileRepository.save(entity);
    return ProfileMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.profileRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
