import { Ticket } from '../../domain/ticket.entity';
import { TicketDTO } from '../dto/ticket.dto';

/**
 * A Ticket mapper object.
 */
export class TicketMapper {
  static fromDTOtoEntity(entityDTO: TicketDTO): Ticket {
    if (!entityDTO) {
      return;
    }
    const entity = new Ticket();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Ticket): TicketDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new TicketDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
