package com.ridehub.user.service;

import com.ridehub.user.service.dto.auth.*;
import java.util.Map;

/**
 * Service Interface for communicating with Keycloak custom registration SPI.
 * Acts as a proxy between frontend and Keycloak SPI endpoints.
 */
public interface KeycloakAuthService {

    /**
     * Send OTP to phone number for registration
     *
     * @param phone the phone number
     * @return the OTP send response
     */
    SendOtpResponseDTO sendRegistrationOtp(String phone);

    /**
     * Verify OTP for registration
     *
     * @param txnId the transaction ID
     * @param code  the OTP code
     * @return the verification response with registration token
     */
    VerifyOtpResponseDTO verifyRegistrationOtp(String txnId, String code);

    /**
     * Complete user registration
     *
     * @param regToken  the registration token
     * @param email     the user email (optional)
     * @param firstName the user first name
     * @param lastName  the user last name
     * @param password  the user password
     * @return the registration completion response
     */
    RegistrationCompleteResponseDTO completeRegistration(String regToken, String email, String firstName,
            String lastName, String password);

    /**
     * Request password reset OTP
     *
     * @param phone the phone number
     * @return the OTP send response
     */
    SendOtpResponseDTO requestPasswordReset(String phone);

    /**
     * Verify password reset OTP
     *
     * @param txnId the transaction ID
     * @param code  the OTP code
     * @return the verification response with reset token
     */
    VerifyOtpResponseDTO verifyPasswordResetOtp(String txnId, String code);

    /**
     * Complete password reset
     *
     * @param resetToken  the reset token
     * @param newPassword the new password
     * @return the reset completion response
     */
    Map<String, Object> completePasswordReset(String resetToken, String newPassword);

    /**
     * Login user with username and password
     *
     * @param username the username (phone number or email). Phone numbers will be
     *                 automatically normalized.
     * @param password the password
     * @return the login response with tokens
     */
    LoginResponseDTO login(String username, String password);

    Map<String, Object> createAdminUser(CreateAdminRequest req);

    Map<String, Object> adminUpdateUserDetails(String keycloak_id, AdminUpdateUserRequest req);

    Map<String, Object> adminUpdateUserPassword(String keycloak_id, AdminUpdatePasswordRequest req);

    /**
     * Update the profile of the currently authenticated user, inferred from their
     * access token.
     *
     * @param accessToken Bearer access token of the current user (not the admin
     *                    token)
     * @param req         fields to update (email, firstName, lastName, phoneNumber)
     * @return { "status": "success" } or { "status":"error", "message": "..." }
     */
    Map<String, Object> updateCurrentUserProfile(String accessToken, UpdateProfileRequest req);

    /**
     * Refresh access token using refresh token
     *
     * @param refreshToken the refresh token
     * @return the login response with new tokens
     */
    LoginResponseDTO refreshToken(String refreshToken);

    /**
     * Logout user by revoking refresh token
     *
     * @param refreshToken the refresh token to revoke
     * @return the logout response
     */
    Map<String, Object> logout(String refreshToken);

    /**
     * Disable user in Keycloak by setting enabled to false
     *
     * @param keycloakId the Keycloak user ID
     * @return the disable response
     */
    Map<String, Object> adminDisableUser(String keycloakId);
}
