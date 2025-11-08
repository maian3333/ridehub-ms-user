import { Driver } from '../../domain/driver.entity';
import { DriverDTO } from '../dto/driver.dto';

/**
 * A Driver mapper object.
 */
export class DriverMapper {
  static fromDTOtoEntity(entityDTO: DriverDTO): Driver {
    if (!entityDTO) {
      return;
    }
    const entity = new Driver();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Driver): DriverDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new DriverDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
