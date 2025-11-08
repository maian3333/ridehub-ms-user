import { Attendant } from '../../domain/attendant.entity';
import { AttendantDTO } from '../dto/attendant.dto';

/**
 * A Attendant mapper object.
 */
export class AttendantMapper {
  static fromDTOtoEntity(entityDTO: AttendantDTO): Attendant {
    if (!entityDTO) {
      return;
    }
    const entity = new Attendant();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Attendant): AttendantDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new AttendantDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
