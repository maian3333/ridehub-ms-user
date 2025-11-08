import { Floor } from '../../domain/floor.entity';
import { FloorDTO } from '../dto/floor.dto';

/**
 * A Floor mapper object.
 */
export class FloorMapper {
  static fromDTOtoEntity(entityDTO: FloorDTO): Floor {
    if (!entityDTO) {
      return;
    }
    const entity = new Floor();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Floor): FloorDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new FloorDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
