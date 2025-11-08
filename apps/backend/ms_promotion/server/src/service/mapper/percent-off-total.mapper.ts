import { PercentOffTotal } from '../../domain/percent-off-total.entity';
import { PercentOffTotalDTO } from '../dto/percent-off-total.dto';

/**
 * A PercentOffTotal mapper object.
 */
export class PercentOffTotalMapper {
  static fromDTOtoEntity(entityDTO: PercentOffTotalDTO): PercentOffTotal {
    if (!entityDTO) {
      return;
    }
    const entity = new PercentOffTotal();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: PercentOffTotal): PercentOffTotalDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new PercentOffTotalDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
