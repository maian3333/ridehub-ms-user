import { Station } from '../../domain/station.entity';
import { StationDTO } from '../dto/station.dto';

/**
 * A Station mapper object.
 */
export class StationMapper {
  static fromDTOtoEntity(entityDTO: StationDTO): Station {
    if (!entityDTO) {
      return;
    }
    const entity = new Station();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Station): StationDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new StationDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
