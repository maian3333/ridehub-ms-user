package com.ridehub.user.service;

import com.ridehub.user.service.dto.FileUserDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.ridehub.user.domain.FileUser}.
 */
public interface FileUserService {
    /**
     * Save a fileUser.
     *
     * @param fileUserDTO the entity to save.
     * @return the persisted entity.
     */
    FileUserDTO save(FileUserDTO fileUserDTO);

    /**
     * Updates a fileUser.
     *
     * @param fileUserDTO the entity to update.
     * @return the persisted entity.
     */
    FileUserDTO update(FileUserDTO fileUserDTO);

    /**
     * Partially updates a fileUser.
     *
     * @param fileUserDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FileUserDTO> partialUpdate(FileUserDTO fileUserDTO);

    /**
     * Get all the FileUserDTO where Profile is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<FileUserDTO> findAllWhereProfileIsNull();

    /**
     * Get the "id" fileUser.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FileUserDTO> findOne(Long id);

    /**
     * Delete the "id" fileUser.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
