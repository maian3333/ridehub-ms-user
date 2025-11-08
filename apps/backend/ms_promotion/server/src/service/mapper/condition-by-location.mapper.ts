import { ConditionByLocation } from '../../domain/condition-by-location.entity';
import { ConditionByLocationDTO } from '../dto/condition-by-location.dto';

/**
 * A ConditionByLocation mapper object.
 */
export class ConditionByLocationMapper {
  static fromDTOtoEntity(entityDTO: ConditionByLocationDTO): ConditionByLocation {
    if (!entityDTO) {
      return;
    }
    const entity = new ConditionByLocation();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ConditionByLocation): ConditionByLocationDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ConditionByLocationDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
