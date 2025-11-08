import { Booking } from '../../domain/booking.entity';
import { BookingDTO } from '../dto/booking.dto';

/**
 * A Booking mapper object.
 */
export class BookingMapper {
  static fromDTOtoEntity(entityDTO: BookingDTO): Booking {
    if (!entityDTO) {
      return;
    }
    const entity = new Booking();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Booking): BookingDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new BookingDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
