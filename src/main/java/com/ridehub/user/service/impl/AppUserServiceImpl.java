package com.ridehub.user.service.impl;

import com.ridehub.user.domain.AppUser;
import com.ridehub.user.repository.AppUserRepository;
import com.ridehub.user.service.AppUserService;
import com.ridehub.user.service.dto.AppUserDTO;
import com.ridehub.user.service.mapper.AppUserMapper;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ridehub.user.domain.AppUser}.
 */
@Service
@Transactional
public class AppUserServiceImpl implements AppUserService {

    private static final Logger LOG = LoggerFactory.getLogger(AppUserServiceImpl.class);

    private final AppUserRepository appUserRepository;

    private final AppUserMapper appUserMapper;

    public AppUserServiceImpl(AppUserRepository appUserRepository, AppUserMapper appUserMapper) {
        this.appUserRepository = appUserRepository;
        this.appUserMapper = appUserMapper;
    }

    @Override
    public AppUserDTO save(AppUserDTO appUserDTO) {
        LOG.debug("Request to save AppUser : {}", appUserDTO);
        AppUser appUser = appUserMapper.toEntity(appUserDTO);
        appUser = appUserRepository.save(appUser);
        return appUserMapper.toDto(appUser);
    }

    @Override
    public AppUserDTO update(AppUserDTO appUserDTO) {
        LOG.debug("Request to update AppUser : {}", appUserDTO);
        AppUser appUser = appUserMapper.toEntity(appUserDTO);
        appUser = appUserRepository.save(appUser);
        return appUserMapper.toDto(appUser);
    }

    @Override
    public Optional<AppUserDTO> partialUpdate(AppUserDTO appUserDTO) {
        LOG.debug("Request to partially update AppUser : {}", appUserDTO);

        return appUserRepository
                .findById(appUserDTO.getId())
                .map(existingAppUser -> {
                    appUserMapper.partialUpdate(existingAppUser, appUserDTO);

                    return existingAppUser;
                })
                .map(appUserRepository::save)
                .map(appUserMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppUserDTO> findOne(Long id) {
        LOG.debug("Request to get AppUser : {}", id);
        return appUserRepository.findById(id).map(appUserMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete AppUser : {}", id);
        appUserRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppUserDTO> findByKeycloakId(UUID keycloakId) {
        LOG.debug("Request to get AppUser by keycloakId : {}", keycloakId);
        return appUserRepository.findByKeycloakId(keycloakId).map(appUserMapper::toDto);
    }

    @Override
    public AppUserDTO syncUserAfterRegistration(UUID keycloakId, String email, String phoneNumber,
            String firstName, String lastName, Boolean isVerified,
            Boolean isActive, String username) {
        LOG.debug("Request to sync user after registration for keycloakId: {}", keycloakId);

        // Check if user already exists
        Optional<AppUser> existingUser = appUserRepository.findByKeycloakId(keycloakId);

        AppUser appUser = existingUser.orElseGet(() -> {
            // Create new user
            AppUser newUser = new AppUser();
            newUser.setKeycloakId(keycloakId);
            newUser.setCreatedAt(Instant.now());
            LOG.debug("Creating new user with keycloakId: {}", keycloakId);
            return newUser;
        });

        if (existingUser.isPresent()) {
            LOG.debug("Updating existing user with keycloakId: {}", keycloakId);
        }

        // Set/update user data
        appUser.setEmail(email != null ? email : "");
        appUser.setPhoneNumber(phoneNumber);
        appUser.setFirstName(firstName);
        appUser.setLastName(lastName);
        appUser.setIsVerified(isVerified != null ? isVerified : true);
        appUser.setIsActive(isActive != null ? isActive : true);
        appUser.setUpdatedAt(Instant.now());
        appUser.setIsDeleted(false);

        appUser = appUserRepository.save(appUser);
        LOG.debug("Successfully synced user data for keycloakId: {}", keycloakId);

        return appUserMapper.toDto(appUser);
    }

    @Override
    public Optional<AppUserDTO> updateLastLogin(UUID keycloakId) {
        LOG.debug("Request to update last login for keycloakId: {}", keycloakId);

        return appUserRepository.findByKeycloakId(keycloakId)
                .map(appUser -> {
                    appUser.setLastLoginAt(Instant.now());
                    appUser.setUpdatedAt(Instant.now());
                    return appUserRepository.save(appUser);
                })
                .map(appUserMapper::toDto);
    }

    /**
     * Admin-initiated profile update used by Keycloak admin flows.
     * Applies only non-null fields; does nothing if the user is not found.
     */
    @Override
    public Optional<AppUserDTO> updateProfileFromAdmin(
            UUID keycloakId,
            String email,
            String phoneNumber,
            String firstName,
            String lastName,
            Boolean enabled) {
        LOG.debug("Admin update profile for keycloakId: {}", keycloakId);

        return appUserRepository.findByKeycloakId(keycloakId)
                .map(appUser -> {
                    if (email != null) {
                        appUser.setEmail(email);
                    }
                    if (phoneNumber != null) {
                        appUser.setPhoneNumber(phoneNumber);
                    }
                    if (firstName != null) {
                        appUser.setFirstName(firstName);
                    }
                    if (lastName != null) {
                        appUser.setLastName(lastName);
                    }
                    if (enabled != null) {
                        // Map Keycloak "enabled" to our "isActive"
                        appUser.setIsActive(enabled);
                    }
                    appUser.setUpdatedAt(Instant.now());
                    return appUserRepository.save(appUser);
                })
                .map(appUserMapper::toDto);
    }

    @Override
    public Optional<AppUserDTO> disableUser(Long id, UUID deletedBy) {
        LOG.debug("Request to disable AppUser with id: {} by admin: {}", id, deletedBy);

        return appUserRepository.findById(id)
                .map(appUser -> {
                    // Set delete status and timestamps
                    appUser.setIsDeleted(true);
                    appUser.setDeletedAt(Instant.now());
                    appUser.setDeletedBy(deletedBy);
                    appUser.setIsActive(false); // Also set inactive
                    appUser.setUpdatedAt(Instant.now());

                    AppUser savedUser = appUserRepository.save(appUser);
                    LOG.info("Successfully disabled user with id: {} by admin: {}", id, deletedBy);
                    return savedUser;
                })
                .map(appUserMapper::toDto);
    }

}
