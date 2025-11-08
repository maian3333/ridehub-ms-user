import { ScheduleOccasion } from '../../domain/schedule-occasion.entity';
import { ScheduleOccasionDTO } from '../dto/schedule-occasion.dto';

/**
 * A ScheduleOccasion mapper object.
 */
export class ScheduleOccasionMapper {
  static fromDTOtoEntity(entityDTO: ScheduleOccasionDTO): ScheduleOccasion {
    if (!entityDTO) {
      return;
    }
    const entity = new ScheduleOccasion();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ScheduleOccasion): ScheduleOccasionDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ScheduleOccasionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
