import { Schedule } from '../../domain/schedule.entity';
import { ScheduleDTO } from '../dto/schedule.dto';

/**
 * A Schedule mapper object.
 */
export class ScheduleMapper {
  static fromDTOtoEntity(entityDTO: ScheduleDTO): Schedule {
    if (!entityDTO) {
      return;
    }
    const entity = new Schedule();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Schedule): ScheduleDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ScheduleDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
