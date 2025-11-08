import { PaymentTransaction } from '../../domain/payment-transaction.entity';
import { PaymentTransactionDTO } from '../dto/payment-transaction.dto';

/**
 * A PaymentTransaction mapper object.
 */
export class PaymentTransactionMapper {
  static fromDTOtoEntity(entityDTO: PaymentTransactionDTO): PaymentTransaction {
    if (!entityDTO) {
      return;
    }
    const entity = new PaymentTransaction();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: PaymentTransaction): PaymentTransactionDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new PaymentTransactionDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
