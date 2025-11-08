import { AppUser } from '../../domain/app-user.entity';
import { AppUserDTO } from '../dto/app-user.dto';

/**
 * A AppUser mapper object.
 */
export class AppUserMapper {
  static fromDTOtoEntity(entityDTO: AppUserDTO): AppUser {
    if (!entityDTO) {
      return;
    }
    const entity = new AppUser();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: AppUser): AppUserDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new AppUserDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
