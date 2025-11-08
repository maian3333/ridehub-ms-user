import { Promotion } from '../../domain/promotion.entity';
import { PromotionDTO } from '../dto/promotion.dto';

/**
 * A Promotion mapper object.
 */
export class PromotionMapper {
  static fromDTOtoEntity(entityDTO: PromotionDTO): Promotion {
    if (!entityDTO) {
      return;
    }
    const entity = new Promotion();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Promotion): PromotionDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new PromotionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
