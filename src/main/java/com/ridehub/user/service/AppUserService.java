package com.ridehub.user.service;

import com.ridehub.user.service.dto.AppUserDTO;
import java.util.Optional;
import java.util.UUID;

/**
 * Service Interface for managing {@link com.ridehub.user.domain.AppUser}.
 */
public interface AppUserService {
    /**
     * Save a appUser.
     *
     * @param appUserDTO the entity to save.
     * @return the persisted entity.
     */
    AppUserDTO save(AppUserDTO appUserDTO);

    /**
     * Updates a appUser.
     *
     * @param appUserDTO the entity to update.
     * @return the persisted entity.
     */
    AppUserDTO update(AppUserDTO appUserDTO);

    /**
     * Partially updates a appUser.
     *
     * @param appUserDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AppUserDTO> partialUpdate(AppUserDTO appUserDTO);

    /**
     * Get the "id" appUser.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AppUserDTO> findOne(Long id);

    /**
     * Delete the "id" appUser.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Find user by Keycloak ID
     *
     * @param keycloakId the Keycloak user ID
     * @return the user entity
     */
    Optional<AppUserDTO> findByKeycloakId(UUID keycloakId);

    /**
     * Sync user data from Keycloak after registration
     *
     * @param keycloakId the Keycloak user ID
     * @param email the user email
     * @param phoneNumber the user phone number
     * @param firstName the user first name
     * @param lastName the user last name
     * @param isVerified whether the user is verified
     * @param isActive whether the user is active
     * @param username the username (usually phone number)
     * @return the synced user entity
     */
    AppUserDTO syncUserAfterRegistration(UUID keycloakId, String email, String phoneNumber,
                                       String firstName, String lastName, Boolean isVerified,
                                       Boolean isActive, String username);

    /**
     * Update user's last login timestamp
     *
     * @param keycloakId the Keycloak user ID
     * @return the updated user entity
     */
    Optional<AppUserDTO> updateLastLogin(UUID keycloakId);

    /**
     * Admin-initiated profile update used by Keycloak admin flows.
     * Applies only non-null fields; does nothing if the user is not found.
     */
    Optional<AppUserDTO> updateProfileFromAdmin(UUID keycloakId, String email, String phoneNumber, String firstName,
            String lastName, Boolean enabled);

    /**
     * Disable user by setting delete status and timestamps
     *
     * @param id the id of the user to disable
     * @param deletedBy the UUID of the admin who is disabling the user
     * @return the disabled user entity
     */
    Optional<AppUserDTO> disableUser(Long id, UUID deletedBy);
}
