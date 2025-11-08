import { ConditionByDate } from '../../domain/condition-by-date.entity';
import { ConditionByDateDTO } from '../dto/condition-by-date.dto';

/**
 * A ConditionByDate mapper object.
 */
export class ConditionByDateMapper {
  static fromDTOtoEntity(entityDTO: ConditionByDateDTO): ConditionByDate {
    if (!entityDTO) {
      return;
    }
    const entity = new ConditionByDate();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ConditionByDate): ConditionByDateDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ConditionByDateDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
