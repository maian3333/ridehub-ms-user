import { AppliedPromotion } from '../../domain/applied-promotion.entity';
import { AppliedPromotionDTO } from '../dto/applied-promotion.dto';

/**
 * A AppliedPromotion mapper object.
 */
export class AppliedPromotionMapper {
  static fromDTOtoEntity(entityDTO: AppliedPromotionDTO): AppliedPromotion {
    if (!entityDTO) {
      return;
    }
    const entity = new AppliedPromotion();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: AppliedPromotion): AppliedPromotionDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new AppliedPromotionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
