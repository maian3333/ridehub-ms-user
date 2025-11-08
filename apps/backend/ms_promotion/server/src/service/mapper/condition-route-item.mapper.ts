import { ConditionRouteItem } from '../../domain/condition-route-item.entity';
import { ConditionRouteItemDTO } from '../dto/condition-route-item.dto';

/**
 * A ConditionRouteItem mapper object.
 */
export class ConditionRouteItemMapper {
  static fromDTOtoEntity(entityDTO: ConditionRouteItemDTO): ConditionRouteItem {
    if (!entityDTO) {
      return;
    }
    const entity = new ConditionRouteItem();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ConditionRouteItem): ConditionRouteItemDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ConditionRouteItemDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
