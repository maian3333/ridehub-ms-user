import { SeatMap } from '../../domain/seat-map.entity';
import { SeatMapDTO } from '../dto/seat-map.dto';

/**
 * A SeatMap mapper object.
 */
export class SeatMapMapper {
  static fromDTOtoEntity(entityDTO: SeatMapDTO): SeatMap {
    if (!entityDTO) {
      return;
    }
    const entity = new SeatMap();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: SeatMap): SeatMapDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new SeatMapDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
