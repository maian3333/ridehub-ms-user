import { Staff } from '../../domain/staff.entity';
import { StaffDTO } from '../dto/staff.dto';

/**
 * A Staff mapper object.
 */
export class StaffMapper {
  static fromDTOtoEntity(entityDTO: StaffDTO): Staff {
    if (!entityDTO) {
      return;
    }
    const entity = new Staff();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Staff): StaffDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new StaffDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
