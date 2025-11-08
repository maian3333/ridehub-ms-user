import { ScheduleTimeSlot } from '../../domain/schedule-time-slot.entity';
import { ScheduleTimeSlotDTO } from '../dto/schedule-time-slot.dto';

/**
 * A ScheduleTimeSlot mapper object.
 */
export class ScheduleTimeSlotMapper {
  static fromDTOtoEntity(entityDTO: ScheduleTimeSlotDTO): ScheduleTimeSlot {
    if (!entityDTO) {
      return;
    }
    const entity = new ScheduleTimeSlot();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ScheduleTimeSlot): ScheduleTimeSlotDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new ScheduleTimeSlotDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
