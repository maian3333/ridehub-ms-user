import { FilePromotion } from '../../domain/file-promotion.entity';
import { FilePromotionDTO } from '../dto/file-promotion.dto';

/**
 * A FilePromotion mapper object.
 */
export class FilePromotionMapper {
  static fromDTOtoEntity(entityDTO: FilePromotionDTO): FilePromotion {
    if (!entityDTO) {
      return;
    }
    const entity = new FilePromotion();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: FilePromotion): FilePromotionDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new FilePromotionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
