import { BuyNGetMFree } from '../../domain/buy-n-get-m-free.entity';
import { BuyNGetMFreeDTO } from '../dto/buy-n-get-m-free.dto';

/**
 * A BuyNGetMFree mapper object.
 */
export class BuyNGetMFreeMapper {
  static fromDTOtoEntity(entityDTO: BuyNGetMFreeDTO): BuyNGetMFree {
    if (!entityDTO) {
      return;
    }
    const entity = new BuyNGetMFree();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: BuyNGetMFree): BuyNGetMFreeDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new BuyNGetMFreeDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
