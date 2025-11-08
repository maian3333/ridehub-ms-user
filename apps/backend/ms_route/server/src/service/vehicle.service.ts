import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleDTO } from '../service/dto/vehicle.dto';
import { VehicleMapper } from '../service/mapper/vehicle.mapper';

const relations = {
  seatMap: true,
  vehicleImg: true,
} as const;

@Injectable()
export class VehicleService {
  logger = new Logger('VehicleService');

  constructor(@InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>) {}

  async findById(id: number): Promise<VehicleDTO | undefined> {
    const result = await this.vehicleRepository.findOne({
      relations,
      where: { id },
    });
    return VehicleMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<VehicleDTO>): Promise<VehicleDTO | undefined> {
    const result = await this.vehicleRepository.findOne(options);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<VehicleDTO>): Promise<[VehicleDTO[], number]> {
    const resultList = await this.vehicleRepository.findAndCount({ ...options, relations });
    const vehicleDTO: VehicleDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(vehicle => vehicleDTO.push(VehicleMapper.fromEntityToDTO(vehicle)));
      resultList[0] = vehicleDTO;
    }
    return resultList;
  }

  async save(vehicleDTO: VehicleDTO, creator?: string): Promise<VehicleDTO | undefined> {
    const entity = VehicleMapper.fromDTOtoEntity(vehicleDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.vehicleRepository.save(entity);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async update(vehicleDTO: VehicleDTO, updater?: string): Promise<VehicleDTO | undefined> {
    const entity = VehicleMapper.fromDTOtoEntity(vehicleDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.vehicleRepository.save(entity);
    return VehicleMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.vehicleRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
