package com.ridehub.user.repository;

import com.ridehub.user.domain.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AppUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long>, JpaSpecificationExecutor<AppUser> {

    /**
     * Find user by Keycloak ID
     * @param keycloakId the Keycloak user ID
     * @return Optional AppUser
     */
    Optional<AppUser> findByKeycloakId(UUID keycloakId);

    /**
     * Find user by email
     * @param email the user email
     * @return Optional AppUser
     */
    Optional<AppUser> findByEmail(String email);

    /**
     * Find user by phone number
     * @param phoneNumber the user phone number
     * @return Optional AppUser
     */
    Optional<AppUser> findByPhoneNumber(String phoneNumber);

    /**
     * Check if user exists by Keycloak ID
     * @param keycloakId the Keycloak user ID
     * @return true if user exists
     */
    boolean existsByKeycloakId(UUID keycloakId);
}
