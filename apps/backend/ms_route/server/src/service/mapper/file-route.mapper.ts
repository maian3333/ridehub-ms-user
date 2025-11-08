import { FileRoute } from '../../domain/file-route.entity';
import { FileRouteDTO } from '../dto/file-route.dto';

/**
 * A FileRoute mapper object.
 */
export class FileRouteMapper {
  static fromDTOtoEntity(entityDTO: FileRouteDTO): FileRoute {
    if (!entityDTO) {
      return;
    }
    const entity = new FileRoute();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: FileRoute): FileRouteDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new FileRouteDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
