import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Route } from '../domain/route.entity';
import { RouteDTO } from '../service/dto/route.dto';
import { RouteMapper } from '../service/mapper/route.mapper';

const relations = {
  origin: true,
  destination: true,
} as const;

@Injectable()
export class RouteService {
  logger = new Logger('RouteService');

  constructor(@InjectRepository(Route) private routeRepository: Repository<Route>) {}

  async findById(id: number): Promise<RouteDTO | undefined> {
    const result = await this.routeRepository.findOne({
      relations,
      where: { id },
    });
    return RouteMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<RouteDTO>): Promise<RouteDTO | undefined> {
    const result = await this.routeRepository.findOne(options);
    return RouteMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<RouteDTO>): Promise<[RouteDTO[], number]> {
    const resultList = await this.routeRepository.findAndCount({ ...options, relations });
    const routeDTO: RouteDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(route => routeDTO.push(RouteMapper.fromEntityToDTO(route)));
      resultList[0] = routeDTO;
    }
    return resultList;
  }

  async save(routeDTO: RouteDTO, creator?: string): Promise<RouteDTO | undefined> {
    const entity = RouteMapper.fromDTOtoEntity(routeDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.routeRepository.save(entity);
    return RouteMapper.fromEntityToDTO(result);
  }

  async update(routeDTO: RouteDTO, updater?: string): Promise<RouteDTO | undefined> {
    const entity = RouteMapper.fromDTOtoEntity(routeDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.routeRepository.save(entity);
    return RouteMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.routeRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
  }
}
