import { Route } from '../../domain/route.entity';
import { RouteDTO } from '../dto/route.dto';

/**
 * A Route mapper object.
 */
export class RouteMapper {
  static fromDTOtoEntity(entityDTO: RouteDTO): Route {
    if (!entityDTO) {
      return;
    }
    const entity = new Route();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Route): RouteDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new RouteDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
