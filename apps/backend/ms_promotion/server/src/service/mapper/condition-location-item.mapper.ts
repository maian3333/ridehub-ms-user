import { ConditionLocationItem } from '../../domain/condition-location-item.entity';
import { ConditionLocationItemDTO } from '../dto/condition-location-item.dto';

/**
 * A ConditionLocationItem mapper object.
 */
export class ConditionLocationItemMapper {
  static fromDTOtoEntity(entityDTO: ConditionLocationItemDTO): ConditionLocationItem {
    if (!entityDTO) {
      return;
    }
    const entity = new ConditionLocationItem();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ConditionLocationItem): ConditionLocationItemDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ConditionLocationItemDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
