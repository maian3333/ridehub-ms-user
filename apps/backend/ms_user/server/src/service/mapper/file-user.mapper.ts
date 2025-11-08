import { FileUser } from '../../domain/file-user.entity';
import { FileUserDTO } from '../dto/file-user.dto';

/**
 * A FileUser mapper object.
 */
export class FileUserMapper {
  static fromDTOtoEntity(entityDTO: FileUserDTO): FileUser {
    if (!entityDTO) {
      return;
    }
    const entity = new FileUser();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: FileUser): FileUserDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new FileUserDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
