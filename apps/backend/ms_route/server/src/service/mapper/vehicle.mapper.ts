import { Vehicle } from '../../domain/vehicle.entity';
import { VehicleDTO } from '../dto/vehicle.dto';

/**
 * A Vehicle mapper object.
 */
export class VehicleMapper {
  static fromDTOtoEntity(entityDTO: VehicleDTO): Vehicle {
    if (!entityDTO) {
      return;
    }
    const entity = new Vehicle();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Vehicle): VehicleDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new VehicleDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
