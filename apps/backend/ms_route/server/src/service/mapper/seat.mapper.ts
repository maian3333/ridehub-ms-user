import { Seat } from '../../domain/seat.entity';
import { SeatDTO } from '../dto/seat.dto';

/**
 * A Seat mapper object.
 */
export class SeatMapper {
  static fromDTOtoEntity(entityDTO: SeatDTO): Seat {
    if (!entityDTO) {
      return;
    }
    const entity = new Seat();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Seat): SeatDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new SeatDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
