import { PaymentWebhookLog } from '../../domain/payment-webhook-log.entity';
import { PaymentWebhookLogDTO } from '../dto/payment-webhook-log.dto';

/**
 * A PaymentWebhookLog mapper object.
 */
export class PaymentWebhookLogMapper {
  static fromDTOtoEntity(entityDTO: PaymentWebhookLogDTO): PaymentWebhookLog {
    if (!entityDTO) {
      return;
    }
    const entity = new PaymentWebhookLog();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: PaymentWebhookLog): PaymentWebhookLogDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new PaymentWebhookLogDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
