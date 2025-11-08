import { ConditionByRoute } from '../../domain/condition-by-route.entity';
import { ConditionByRouteDTO } from '../dto/condition-by-route.dto';

/**
 * A ConditionByRoute mapper object.
 */
export class ConditionByRouteMapper {
  static fromDTOtoEntity(entityDTO: ConditionByRouteDTO): ConditionByRoute {
    if (!entityDTO) {
      return;
    }
    const entity = new ConditionByRoute();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ConditionByRoute): ConditionByRouteDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ConditionByRouteDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
