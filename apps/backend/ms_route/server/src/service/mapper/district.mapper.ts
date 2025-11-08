import { District } from '../../domain/district.entity';
import { DistrictDTO } from '../dto/district.dto';

/**
 * A District mapper object.
 */
export class DistrictMapper {
  static fromDTOtoEntity(entityDTO: DistrictDTO): District {
    if (!entityDTO) {
      return;
    }
    const entity = new District();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: District): DistrictDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new DistrictDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
