import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Address } from '../domain/address.entity';
import { AddressDTO } from '../service/dto/address.dto';
import { AddressMapper } from '../service/mapper/address.mapper';

const relations = {
  ward: true,
} as const;

@Injectable()
export class AddressService {
  logger = new Logger('AddressService');

  constructor(@InjectRepository(Address) private addressRepository: Repository<Address>) {}

  async findById(id: number): Promise<AddressDTO | undefined> {
    const result = await this.addressRepository.findOne({
      relations,
      where: { id },
    });
    return AddressMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<AddressDTO>): Promise<AddressDTO | undefined> {
    const result = await this.addressRepository.findOne(options);
    return AddressMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<AddressDTO>): Promise<[AddressDTO[], number]> {
    const resultList = await this.addressRepository.findAndCount({ ...options, relations });
    const addressDTO: AddressDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(address => addressDTO.push(AddressMapper.fromEntityToDTO(address)));
      resultList[0] = addressDTO;
    }
    return resultList;
  }

  async save(addressDTO: AddressDTO, creator?: string): Promise<AddressDTO | undefined> {
    const entity = AddressMapper.fromDTOtoEntity(addressDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.addressRepository.save(entity);
    return AddressMapper.fromEntityToDTO(result);
  }

  async update(addressDTO: AddressDTO, updater?: string): Promise<AddressDTO | undefined> {
    const entity = AddressMapper.fromDTOtoEntity(addressDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.addressRepository.save(entity);
    return AddressMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.addressRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
