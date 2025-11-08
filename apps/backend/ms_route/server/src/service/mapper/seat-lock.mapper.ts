import { SeatLock } from '../../domain/seat-lock.entity';
import { SeatLockDTO } from '../dto/seat-lock.dto';

/**
 * A SeatLock mapper object.
 */
export class SeatLockMapper {
  static fromDTOtoEntity(entityDTO: SeatLockDTO): SeatLock {
    if (!entityDTO) {
      return;
    }
    const entity = new SeatLock();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: SeatLock): SeatLockDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new SeatLockDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
