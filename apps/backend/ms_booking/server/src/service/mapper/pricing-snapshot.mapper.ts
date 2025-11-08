import { PricingSnapshot } from '../../domain/pricing-snapshot.entity';
import { PricingSnapshotDTO } from '../dto/pricing-snapshot.dto';

/**
 * A PricingSnapshot mapper object.
 */
export class PricingSnapshotMapper {
  static fromDTOtoEntity(entityDTO: PricingSnapshotDTO): PricingSnapshot {
    if (!entityDTO) {
      return;
    }
    const entity = new PricingSnapshot();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: PricingSnapshot): PricingSnapshotDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new PricingSnapshotDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
