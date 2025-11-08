import { FileBooking } from '../../domain/file-booking.entity';
import { FileBookingDTO } from '../dto/file-booking.dto';

/**
 * A FileBooking mapper object.
 */
export class FileBookingMapper {
  static fromDTOtoEntity(entityDTO: FileBookingDTO): FileBooking {
    if (!entityDTO) {
      return;
    }
    const entity = new FileBooking();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: FileBooking): FileBookingDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new FileBookingDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
