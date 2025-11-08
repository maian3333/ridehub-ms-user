import { ConditionDateItem } from '../../domain/condition-date-item.entity';
import { ConditionDateItemDTO } from '../dto/condition-date-item.dto';

/**
 * A ConditionDateItem mapper object.
 */
export class ConditionDateItemMapper {
  static fromDTOtoEntity(entityDTO: ConditionDateItemDTO): ConditionDateItem {
    if (!entityDTO) {
      return;
    }
    const entity = new ConditionDateItem();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ConditionDateItem): ConditionDateItemDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ConditionDateItemDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
