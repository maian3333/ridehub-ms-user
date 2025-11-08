import { Invoice } from '../../domain/invoice.entity';
import { InvoiceDTO } from '../dto/invoice.dto';

/**
 * A Invoice mapper object.
 */
export class InvoiceMapper {
  static fromDTOtoEntity(entityDTO: InvoiceDTO): Invoice {
    if (!entityDTO) {
      return;
    }
    const entity = new Invoice();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Invoice): InvoiceDTO {
    if (!entity) {
      return;
    }
    const entityDTO = new InvoiceDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
