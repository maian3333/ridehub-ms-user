import { Province } from '../../domain/province.entity';
import { ProvinceDTO } from '../dto/province.dto';

/**
 * A Province mapper object.
 */
export class ProvinceMapper {
  static fromDTOtoEntity(entityDTO: ProvinceDTO): Province {
    if (!entityDTO) {
      return;
    }
    const entity = new Province();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Province): ProvinceDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ProvinceDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
