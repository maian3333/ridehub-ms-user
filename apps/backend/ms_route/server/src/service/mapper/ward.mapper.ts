import { Ward } from '../../domain/ward.entity';
import { WardDTO } from '../dto/ward.dto';

/**
 * A Ward mapper object.
 */
export class WardMapper {
  static fromDTOtoEntity(entityDTO: WardDTO): Ward {
    if (!entityDTO) {
      return;
    }
    const entity = new Ward();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Ward): WardDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new WardDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
