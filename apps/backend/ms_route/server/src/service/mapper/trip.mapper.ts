import { Trip } from '../../domain/trip.entity';
import { TripDTO } from '../dto/trip.dto';

/**
 * A Trip mapper object.
 */
export class TripMapper {
  static fromDTOtoEntity(entityDTO: TripDTO): Trip {
    if (!entityDTO) {
      return;
    }
    const entity = new Trip();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Trip): TripDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new TripDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
