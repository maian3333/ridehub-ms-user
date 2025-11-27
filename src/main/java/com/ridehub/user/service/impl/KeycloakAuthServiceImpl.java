package com.ridehub.user.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ridehub.user.service.AppUserService;
import com.ridehub.user.service.KeycloakAuthService;
import com.ridehub.user.service.dto.AppUserDTO;
import com.ridehub.user.service.dto.auth.*;
import com.ridehub.user.util.PhoneUtil;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for communicating with Keycloak custom registration
 * SPI.
 */
@Service
public class KeycloakAuthServiceImpl implements KeycloakAuthService {

    private static final Logger log = LoggerFactory.getLogger(KeycloakAuthServiceImpl.class);

    // --- HTTP/Serialization ---
    private static final String HDR_JSON = "application/json";
    private static final String HDR_FORM = "application/x-www-form-urlencoded";
    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(10);
    private static final Duration REQ_TIMEOUT = Duration.ofSeconds(30);
    private static final int LOG_BODY_TRUNCATE = 600;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    // --- Configs ---
    private final String keycloakBaseUrl; // e.g., https://keycloak.example.com
    private final String realm; // e.g., jhipster
    private final String userClientId; // your public OIDC client for password grant
    private final String userClientSecret;

    private final String adminClientId; // dedicated service client for admin operations
    private final String adminClientSecret;

    private final AppUserService appUserService;

    public KeycloakAuthServiceImpl(
            ObjectMapper objectMapper,
            AppUserService appUserService,
            @Value("${spring.security.oauth2.client.registration.oidc.client-id}") String userClientId,
            @Value("${spring.security.oauth2.client.registration.oidc.client-secret:}") String userClientSecret,
            @Value("${app.keycloak.base-url:https://keycloak.appf4s.io.vn}") String keycloakBaseUrl,
            @Value("${app.keycloak.realm:jhipster}") String realm,
            @Value("${app.keycloak.admin.client-id:svc-admin-bootstrap}") String adminClientId,
            @Value("${app.keycloak.admin.client-secret:EB4eohc7BEY3tw1Rjg7FS8xMLfi95n0n}") String adminClientSecret) {
        this.objectMapper = objectMapper;
        this.appUserService = appUserService;
        this.userClientId = userClientId;
        this.userClientSecret = Optional.ofNullable(userClientSecret).orElse("");
        this.keycloakBaseUrl = stripTrailingSlash(keycloakBaseUrl);
        this.realm = realm;
        this.adminClientId = adminClientId;
        this.adminClientSecret = adminClientSecret;

        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(CONNECT_TIMEOUT)
                .build();
    }

    // ============================
    // Public API
    // ============================

    @Override
    public SendOtpResponseDTO sendRegistrationOtp(String phone) {
        log.debug("Sending registration OTP to phone: {}", phone);
        try {
            Map<String, Object> res = postJson(
                    realmPath("/customreg/send-otp"),
                    Map.of("phone", phone),
                    200);
            String txnId = (String) res.get("txnId");
            Number expiresIn = asNumber(res.get("expiresIn"), 0);
            return SendOtpResponseDTO.success(txnId, expiresIn.longValue());
        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            return SendOtpResponseDTO.error(
                errorDetails.getDisplayMessage(),
                errorDetails.getErrorCode(),
                errorDetails.getErrorDescription()
            );
        } catch (Exception e) {
            log.error("Error sending registration OTP", e);
            return SendOtpResponseDTO.error("Failed to send OTP: " + e.getMessage());
        }
    }

    @Override
    public VerifyOtpResponseDTO verifyRegistrationOtp(String txnId, String code) {
        log.debug("Verifying registration OTP for txnId: {}", txnId);
        try {
            Map<String, Object> res = postJson(
                    realmPath("/customreg/verify-otp"),
                    Map.of("txnId", txnId, "code", code),
                    200);
            String regToken = (String) res.get("regToken");
            Number expiresIn = asNumber(res.get("expiresIn"), 0);
            return VerifyOtpResponseDTO.registrationToken(regToken, expiresIn.longValue());
        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            return VerifyOtpResponseDTO.error(
                errorDetails.getDisplayMessage(),
                errorDetails.getErrorCode(),
                errorDetails.getErrorDescription()
            );
        } catch (Exception e) {
            log.error("Error verifying registration OTP", e);
            return VerifyOtpResponseDTO.error("Failed to verify OTP: " + e.getMessage());
        }
    }

    @Override
    public RegistrationCompleteResponseDTO completeRegistration(
            String regToken, String email, String firstName, String lastName, String password) {
        log.debug("Completing registration for user: {} {}", firstName, lastName);
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("regToken", regToken);
            body.put("email", Optional.ofNullable(email).orElse(""));
            body.put("firstName", firstName);
            body.put("lastName", lastName);
            body.put("password", password);

            Map<String, Object> res = postJson(
                    realmPath("/customreg/complete"),
                    body,
                    201);
            String keycloakUserId = (String) res.get("userId");

            // best-effort sync
            try {
                syncUserDataAfterRegistration(keycloakUserId, email, firstName, lastName, regToken);
                log.info("Synced user data after registration for Keycloak user: {}", keycloakUserId);
            } catch (Exception se) {
                log.warn("Sync after registration failed: {}", se.getMessage());
            }

            // return both id and username as keycloakUserId, if you want to preserve
            // original behavior
            return RegistrationCompleteResponseDTO.success(keycloakUserId, keycloakUserId);

        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            return RegistrationCompleteResponseDTO.error(
                errorDetails.getDisplayMessage(),
                errorDetails.getErrorCode(),
                errorDetails.getErrorDescription()
            );
        } catch (Exception e) {
            log.error("Error completing registration", e);
            return RegistrationCompleteResponseDTO.error("Failed to complete registration: " + e.getMessage());
        }
    }

    @Override
    public SendOtpResponseDTO requestPasswordReset(String phone) {
        log.debug("Requesting password reset OTP for phone: {}", phone);
        try {
            Map<String, Object> res = postJson(
                    realmPath("/customreg/reset/request"),
                    Map.of("phone", phone),
                    200);
            String txnId = (String) res.get("txnId");
            Number expiresIn = asNumber(res.get("expiresIn"), 0);
            return SendOtpResponseDTO.success(txnId, expiresIn.longValue());
        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            return SendOtpResponseDTO.error(
                errorDetails.getDisplayMessage(),
                errorDetails.getErrorCode(),
                errorDetails.getErrorDescription()
            );
        } catch (Exception e) {
            log.error("Error requesting password reset", e);
            return SendOtpResponseDTO.error("Failed to request password reset: " + e.getMessage());
        }
    }

    @Override
    public VerifyOtpResponseDTO verifyPasswordResetOtp(String txnId, String code) {
        log.debug("Verifying password reset OTP for txnId: {}", txnId);
        try {
            Map<String, Object> res = postJson(
                    realmPath("/customreg/reset/verify"),
                    Map.of("txnId", txnId, "code", code),
                    200);
            String resetToken = (String) res.get("resetToken");
            Number expiresIn = asNumber(res.get("expiresIn"), 0);
            return VerifyOtpResponseDTO.resetToken(resetToken, expiresIn.longValue());
        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            return VerifyOtpResponseDTO.error(
                errorDetails.getDisplayMessage(),
                errorDetails.getErrorCode(),
                errorDetails.getErrorDescription()
            );
        } catch (Exception e) {
            log.error("Error verifying password reset OTP", e);
            return VerifyOtpResponseDTO.error("Failed to verify OTP: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> completePasswordReset(String resetToken, String newPassword) {
        log.debug("Completing password reset");
        try {
            postJson(
                    realmPath("/customreg/reset/complete"),
                    Map.of("resetToken", resetToken, "newPassword", newPassword),
                    200);
            return Map.of("status", "success", "message", "Password reset successfully");
        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            return Map.of("status", "error", "message", errorDetails.getDisplayMessage());
        } catch (Exception e) {
            log.error("Error completing password reset", e);
            return Map.of("status", "error", "message", "Failed to reset password: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> createAdminUser(CreateAdminRequest req) {
        try {
            String adminAccessToken = getAdminAccessToken();

            // 1) Create user
            String usersApi = adminPath("/users");
            Map<String, Object> kcUser = new HashMap<>();
            if (req.username() != null)
                kcUser.put("username", req.username());
            if (req.email() != null)
                kcUser.put("email", req.email());
            if (req.firstName() != null)
                kcUser.put("firstName", req.firstName());
            if (req.lastName() != null)
                kcUser.put("lastName", req.lastName());
            kcUser.put("enabled", Boolean.TRUE);
            kcUser.put("emailVerified", Boolean.TRUE.equals(req.emailVerified()));

            HttpRequest createReq = HttpRequest.newBuilder()
                    .uri(uri(usersApi))
                    .header("Authorization", "Bearer " + adminAccessToken)
                    .header("Content-Type", HDR_JSON)
                    .timeout(REQ_TIMEOUT)
                    .POST(HttpRequest.BodyPublishers.ofString(writeJson(kcUser)))
                    .build();

            HttpResponse<Void> createRes = httpClient.send(createReq, HttpResponse.BodyHandlers.discarding());
            if (createRes.statusCode() != 201) {
                throw new IllegalStateException("Create user failed: HTTP " + createRes.statusCode());
            }

            // 1.1) Find created user id
            String searchApi = usersApi + "?username=" + enc(req.username()) + "&exact=true";
            Map<String, Object> found = getJsonArrayFirst(searchApi, adminAccessToken);
            String userId = (String) found.get("id");
            if (userId == null)
                throw new IllegalStateException("User not found after creation");

            // 2) Set password
            String pwdApi = adminPath("/users/" + userId + "/reset-password");
            Map<String, Object> cred = Map.of("type", "password", "value", req.password(), "temporary", false);
            putJson(pwdApi, cred, 204, adminAccessToken);

            // 3) Assign ROLE_ADMIN
            String role = "ROLE_ADMIN";
            String roleApi = adminPath("/roles/" + role);
            Map<String, Object> roleObj = getJson(roleApi, adminAccessToken, 200);
            String mapApi = adminPath("/users/" + userId + "/role-mappings/realm");
            postJson(mapApi, List.of(Map.of("id", roleObj.get("id"), "name", roleObj.get("name"))), 204,
                    adminAccessToken);

            // 4) Sync to ms_user DB (no regToken needed)
            UUID kcUuid = UUID.fromString(userId);
            appUserService.syncUserAfterRegistration(
                    kcUuid,
                    req.email(),
                    req.phoneNumber(),
                    req.firstName(),
                    req.lastName(),
                    true, // isVerified
                    true, // isActive
                    req.username());

            return Map.of("status", "success", "keycloakUserId", userId);
        } catch (Exception e) {
            log.error("createAdminUser failed: {}", e.getMessage(), e);
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

    @Override
    public LoginResponseDTO login(String username, String password) {
        log.debug("Logging in user: {}", username);
        try {
            String normalizedUsername = username;
            if (PhoneUtil.looksLikePhoneNumber(username)) {
                String n = PhoneUtil.normalizePhone(username);
                if (n != null) {
                    log.debug("Normalized phone number from {} to {}", username, n);
                    normalizedUsername = n;
                }
            }

            Map<String, String> form = new HashMap<>();
            form.put("grant_type", "password");
            form.put("client_id", userClientId);
            if (!userClientSecret.isBlank())
                form.put("client_secret", userClientSecret);
            form.put("username", normalizedUsername);
            form.put("password", password);

            Map<String, Object> tokenResponse = postForm(
                    realmPath("/protocol/openid-connect/token"),
                    form,
                    200);

            String accessToken = (String) tokenResponse.get("access_token");
            String refreshToken = (String) tokenResponse.get("refresh_token");
            String tokenType = (String) tokenResponse.get("token_type");
            Number expiresIn = asNumber(tokenResponse.get("expires_in"), 0);
            String scope = (String) tokenResponse.get("scope");

            LoginResponseDTO dto = LoginResponseDTO.success(accessToken, refreshToken, tokenType,
                    expiresIn.longValue());
            dto.setScope(scope);

            try {
                LoginResponseDTO.UserInfoDTO userInfo = extractUserInfoFromToken(accessToken);
                dto.setUserInfo(userInfo);
                syncUserDataAfterLogin(userInfo);
            } catch (Exception ex) {
                log.warn("Failed to extract user info or sync data: {}", ex.getMessage());
            }

            return dto;

        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            // For login, we still want to use user-friendly messages but preserve original error details
            String userFriendlyMessage = getLoginErrorMessage(errorDetails.getErrorCode(), errorDetails.getErrorDescription());
            return LoginResponseDTO.error(
                userFriendlyMessage,
                errorDetails.getErrorCode(),
                errorDetails.getErrorDescription()
            );
        } catch (Exception e) {
            log.error("Error during login", e);
            return LoginResponseDTO.error("Login failed: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> adminUpdateUserDetails(String keycloak_id, AdminUpdateUserRequest req) {
        try {
            String token = getAdminAccessToken();

            // 1) Get current
            String userApi = adminPath("/users/" + keycloak_id);
            Map<String, Object> kcUser = getJson(userApi, token, 200);

            // 2) Patch fields
            if (req.email() != null)
                kcUser.put("email", req.email());
            if (req.firstName() != null)
                kcUser.put("firstName", req.firstName());
            if (req.lastName() != null)
                kcUser.put("lastName", req.lastName());
            if (req.enabled() != null)
                kcUser.put("enabled", req.enabled());
            if (req.emailVerified() != null)
                kcUser.put("emailVerified", req.emailVerified());

            if (req.phoneNumber() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> attrs = (Map<String, Object>) kcUser.getOrDefault("attributes", new HashMap<>());
                attrs.put("phone_number", List.of(req.phoneNumber())); // Keycloak requires List<String>
                kcUser.put("attributes", attrs);
            }

            // 3) PUT update
            putJson(userApi, kcUser, 204, token);

            // 4) Sync DB
            try {
                UUID kcUuid = UUID.fromString(keycloak_id);
                appUserService.updateProfileFromAdmin(
                        kcUuid,
                        req.email(),
                        req.phoneNumber(),
                        req.firstName(),
                        req.lastName(),
                        req.enabled());
            } catch (Exception e) {
                log.warn("Sync ms_user failed (update details): {}", e.getMessage());
            }

            return Map.of("status", "success");
        } catch (Exception e) {
            log.error("adminUpdateUserDetails failed", e);
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

    @Override
    public Map<String, Object> adminUpdateUserPassword(String keycloak_id, AdminUpdatePasswordRequest req) {
        try {
            String token = getAdminAccessToken();
            String pwdApi = adminPath("/users/" + keycloak_id + "/reset-password");
            Map<String, Object> cred = Map.of(
                    "type", "password",
                    "value", req.newPassword(),
                    "temporary", req.temporary());
            putJson(pwdApi, cred, 204, token);
            return Map.of("status", "success");
        } catch (Exception e) {
            log.error("adminUpdateUserPassword failed", e);
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

    @Override
    public Map<String, Object> updateCurrentUserProfile(String accessToken, UpdateProfileRequest req) {
        try {
            // 1) Get current user id from THEIR access token (self)
            Map<String, Object> claims = decodeJwtClaims(accessToken);
            String userId = (String) claims.get("sub");
            if (userId == null || userId.isBlank()) {
                return Map.of("status", "error", "message", "Cannot infer current user id from token");
            }

            // 2) Reuse your existing admin path to actually perform the update.
            // (Server-to-server via admin client ensures consistent writes and attribute
            // handling.)
            String adminToken = getAdminAccessToken();

            // 2.1) Fetch current KC user object
            String userApi = adminPath("/users/" + userId);
            Map<String, Object> kcUser = getJson(userApi, adminToken, 200);

            // 2.2) Patch allowed fields only
            if (req.email() != null)
                kcUser.put("email", req.email());
            if (req.firstName() != null)
                kcUser.put("firstName", req.firstName());
            if (req.lastName() != null)
                kcUser.put("lastName", req.lastName());

            if (req.phoneNumber() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> attrs = (Map<String, Object>) kcUser.getOrDefault("attributes", new HashMap<>());
                attrs.put("phone_number", List.of(req.phoneNumber())); // Keycloak expects List<String>
                kcUser.put("attributes", attrs);
            }

            // 2.3) Persist to Keycloak
            putJson(userApi, kcUser, 204, adminToken);

            // 3) Best-effort sync to ms_user DB
            try {
                UUID kcUuid = UUID.fromString(userId);
                appUserService.updateProfileFromAdmin(
                        kcUuid,
                        req.email(),
                        req.phoneNumber(),
                        req.firstName(),
                        req.lastName(),
                        null // enabled unchanged
                );
            } catch (Exception e) {
                log.warn("Self-update: ms_user sync failed: {}", e.getMessage());
            }

            return Map.of("status", "success");
        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            String message = errorDetails.getDisplayMessage();
            return Map.of("status", "error", "message", message != null ? message : "Update failed: HTTP " + hp.status());
        } catch (Exception e) {
            log.error("updateCurrentUserProfile failed", e);
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

    @Override
    public LoginResponseDTO refreshToken(String refreshToken) {
        log.debug("Refreshing access token");
        try {
            Map<String, String> form = new HashMap<>();
            form.put("grant_type", "refresh_token");
            form.put("client_id", userClientId);
            if (!userClientSecret.isBlank())
                form.put("client_secret", userClientSecret);
            form.put("refresh_token", refreshToken);

            Map<String, Object> tokenResponse = postForm(
                    realmPath("/protocol/openid-connect/token"),
                    form,
                    200);

            String accessToken = (String) tokenResponse.get("access_token");
            String newRefreshToken = (String) tokenResponse.get("refresh_token");
            String tokenType = (String) tokenResponse.get("token_type");
            Number expiresIn = asNumber(tokenResponse.get("expires_in"), 0);
            String scope = (String) tokenResponse.get("scope");

            LoginResponseDTO dto = LoginResponseDTO.success(accessToken, newRefreshToken, tokenType,
                    expiresIn.longValue());
            dto.setScope(scope);

            try {
                LoginResponseDTO.UserInfoDTO userInfo = extractUserInfoFromToken(accessToken);
                dto.setUserInfo(userInfo);
                // Update last login time for refresh token usage
                syncUserDataAfterLogin(userInfo);
            } catch (Exception ex) {
                log.warn("Failed to extract user info or sync data during refresh: {}", ex.getMessage());
            }

            return dto;

        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            String userFriendlyMessage = getRefreshTokenErrorMessage(errorDetails.getErrorCode(), errorDetails.getErrorDescription());
            return LoginResponseDTO.error(
                userFriendlyMessage,
                errorDetails.getErrorCode(),
                errorDetails.getErrorDescription()
            );
        } catch (Exception e) {
            log.error("Error during token refresh", e);
            return LoginResponseDTO.error("Token refresh failed: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> logout(String refreshToken) {
        log.debug("Logging out user by revoking refresh token");
        try {
            Map<String, String> form = new HashMap<>();
            form.put("token", refreshToken);
            form.put("token_type_hint", "refresh_token");
            form.put("client_id", userClientId);
            if (!userClientSecret.isBlank())
                form.put("client_secret", userClientSecret);

            // Call Keycloak's token revocation endpoint
            postForm(
                    realmPath("/protocol/openid-connect/revoke"),
                    form,
                    200);

            return Map.of("status", "success", "message", "Logout successful");

        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            log.warn("Logout failed with HTTP {}: {}", hp.status(), errorDetails.getDisplayMessage());
            return Map.of("status", "error", "message", errorDetails.getDisplayMessage());
        } catch (Exception e) {
            log.error("Error during logout", e);
            return Map.of("status", "error", "message", "Logout failed: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> adminDisableUser(String keycloakId) {
        log.debug("Disabling user in Keycloak: {}", keycloakId);
        try {
            String adminToken = getAdminAccessToken();

            // First, logout the user by killing all their sessions
            try {
                String logoutApi = adminPath("/users/" + keycloakId + "/logout");
                HttpRequest logoutReq = HttpRequest.newBuilder()
                        .uri(uri(logoutApi))
                        .header("Authorization", "Bearer " + adminToken)
                        .timeout(REQ_TIMEOUT)
                        .POST(HttpRequest.BodyPublishers.noBody())
                        .build();

                HttpResponse<Void> logoutRes = httpClient.send(logoutReq, HttpResponse.BodyHandlers.discarding());
                if (logoutRes.statusCode() == 204) {
                    log.info("Successfully logged out user sessions for: {}", keycloakId);
                } else {
                    log.warn("Logout sessions returned HTTP {}, continuing with disable", logoutRes.statusCode());
                }
            } catch (Exception logoutEx) {
                log.warn("Failed to logout user sessions (continuing with disable): {}", logoutEx.getMessage());
            }

            // Get current user data
            String userApi = adminPath("/users/" + keycloakId);
            Map<String, Object> kcUser = getJson(userApi, adminToken, 200);

            // Set enabled to false to disable the user
            kcUser.put("enabled", false);

            // Update user in Keycloak
            putJson(userApi, kcUser, 204, adminToken);

            log.info("Successfully disabled user in Keycloak: {}", keycloakId);
            return Map.of("status", "success", "message", "User disabled successfully in Keycloak and sessions terminated");

        } catch (HttpProblem hp) {
            KeycloakErrorDetails errorDetails = extractKeycloakErrorDetails(hp.body());
            log.error("Failed to disable user in Keycloak: HTTP {}: {}", hp.status(), errorDetails.getDisplayMessage());
            return Map.of("status", "error", "message", errorDetails.getDisplayMessage());
        } catch (Exception e) {
            log.error("Error disabling user in Keycloak: {}", e.getMessage(), e);
            return Map.of("status", "error", "message", "Failed to disable user in Keycloak: " + e.getMessage());
        }
    }
    // ============================
    // Helpers
    // ============================

    private String getAdminAccessToken() throws Exception {
        Map<String, String> form = new HashMap<>();
        form.put("grant_type", "client_credentials");
        form.put("client_id", adminClientId);
        form.put("client_secret", adminClientSecret);

        Map<String, Object> token = postForm(
                realmPath("/protocol/openid-connect/token"),
                form,
                200);
        String at = (String) token.get("access_token");
        if (at == null || at.isBlank())
            throw new IllegalStateException("No admin access_token returned");
        return at;
    }

    private LoginResponseDTO.UserInfoDTO extractUserInfoFromToken(String accessToken) {
        try {
            Map<String, Object> claims = decodeJwtClaims(accessToken);
            LoginResponseDTO.UserInfoDTO userInfo = new LoginResponseDTO.UserInfoDTO();
            userInfo.setKeycloakId((String) claims.get("sub"));
            userInfo.setUsername((String) claims.get("preferred_username"));
            userInfo.setEmail((String) claims.get("email"));
            userInfo.setFirstName((String) claims.get("given_name"));
            userInfo.setLastName((String) claims.get("family_name"));
            userInfo.setPhoneNumber((String) claims.get("phone_number"));
            userInfo.setEmailVerified(Boolean.TRUE.equals(claims.get("email_verified")));
            userInfo.setPhoneVerified(Boolean.TRUE.equals(claims.get("phone_number_verified")));
            return userInfo;
        } catch (Exception e) {
            log.error("Error extracting user info from token", e);
            throw new RuntimeException("Failed to extract user info from token", e);
        }
    }

    private void syncUserDataAfterLogin(LoginResponseDTO.UserInfoDTO userInfo) {
        try {
            if (userInfo.getKeycloakId() != null) {
                UUID keycloakUuid = UUID.fromString(userInfo.getKeycloakId());

                // Try to update last login for existing user
                Optional<AppUserDTO> existingUser = appUserService.updateLastLogin(keycloakUuid);

                if (existingUser.isPresent()) {
                    log.debug("Updated last login for existing user: {}", userInfo.getKeycloakId());
                } else {
                    // User doesn't exist locally, create/sync from Keycloak data
                    log.info("User not found locally, syncing from Keycloak: {}", userInfo.getKeycloakId());
                    appUserService.syncUserAfterRegistration(
                            keycloakUuid,
                            userInfo.getEmail(),
                            userInfo.getPhoneNumber(),
                            userInfo.getFirstName(),
                            userInfo.getLastName(),
                            userInfo.isEmailVerified() || userInfo.isPhoneVerified(), // isVerified if either email or phone is verified
                            true, // isActive - assume active since they can login
                            userInfo.getUsername() // username
                    );
                    log.info("Successfully synced user data from Keycloak for: {}", userInfo.getKeycloakId());
                }
            }
        } catch (Exception e) {
            log.warn("Error syncing user data after login: {}", e.getMessage());
        }
    }

    private void syncUserDataAfterRegistration(
            String keycloakUserId, String email, String firstName, String lastName, String regToken) {
        try {
            String phoneNumber = extractPhoneFromToken(regToken, "phone");
            UUID keycloakUuid = UUID.fromString(keycloakUserId);
            appUserService.syncUserAfterRegistration(
                    keycloakUuid,
                    email,
                    phoneNumber,
                    firstName,
                    lastName,
                    true, // isVerified
                    true, // isActive
                    phoneNumber // username
            );
            log.debug("Synced user data for Keycloak user: {}", keycloakUserId);
        } catch (Exception e) {
            log.error("Error syncing user data after registration", e);
            throw new RuntimeException("Failed to sync user data", e);
        }
    }

    private String extractPhoneFromToken(String jwt, String claimName) {
        try {
            Map<String, Object> claims = decodeJwtClaims(jwt);
            return (String) claims.get(claimName);
        } catch (Exception e) {
            log.warn("Failed to extract {} from token: {}", claimName, e.getMessage());
            return null;
        }
    }

    private String getErrorMessage(String errorCode) {
        if (errorCode == null)
            return "Unknown error";
        return switch (errorCode) {
            case "bad_phone" -> "Invalid phone number format";
            case "sms_failed" -> "Failed to send SMS";
            case "invalid_code" -> "Invalid or expired OTP code";
            case "no_phone" -> "Phone number not found in token";
            case "phone_exists" -> "Phone number already registered";
            case "no_user" -> "User not found";
            default -> "Unknown error: " + errorCode;
        };
    }

    private String getLoginErrorMessage(String error, String description) {
        if (error == null && description != null)
            return description;
        return switch (String.valueOf(error)) {
            case "invalid_grant" -> "Invalid username or password";
            case "invalid_client" -> "Invalid client configuration";
            case "unauthorized_client" -> "Client not authorized";
            case "unsupported_grant_type" -> "Unsupported grant type";
            case "invalid_scope" -> "Invalid scope";
            default -> (description != null ? description : "Login failed: " + error);
        };
    }

    private String getRefreshTokenErrorMessage(String error, String description) {
        if (error == null && description != null)
            return description;
        return switch (String.valueOf(error)) {
            case "invalid_grant" -> "Invalid or expired refresh token";
            case "invalid_client" -> "Invalid client configuration";
            case "unauthorized_client" -> "Client not authorized";
            case "unsupported_grant_type" -> "Unsupported grant type";
            case "invalid_scope" -> "Invalid scope";
            default -> (description != null ? description : "Token refresh failed: " + error);
        };
    }

    // ============================
    // HTTP Helpers (DRY)
    // ============================

    private Map<String, Object> getJson(String path, String bearer, int expected) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(uri(path))
                .header("Authorization", "Bearer " + bearer)
                .timeout(REQ_TIMEOUT)
                .GET()
                .build();
        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        return requireStatus(res, expected);
    }

    private Map<String, Object> getJsonArrayFirst(String path, String bearer) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(uri(path))
                .header("Authorization", "Bearer " + bearer)
                .timeout(REQ_TIMEOUT)
                .GET()
                .build();
        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() != 200)
            throw new HttpProblem(res.statusCode(), res.body());
        List<Map<String, Object>> list = parse(res.body(), new TypeReference<List<Map<String, Object>>>() {
        });
        return list.isEmpty() ? Map.of() : list.get(0);
    }

    private Map<String, Object> postJson(String path, Object body, int expected) throws Exception {
        return postJson(path, body, expected, null);
    }

    private Map<String, Object> postJson(String path, Object body, int expected, String bearer) throws Exception {
        HttpRequest.Builder b = HttpRequest.newBuilder()
                .uri(uri(path))
                .header("Content-Type", HDR_JSON)
                .timeout(REQ_TIMEOUT)
                .POST(HttpRequest.BodyPublishers.ofString(writeJson(body)));
        if (bearer != null)
            b.header("Authorization", "Bearer " + bearer);
        HttpResponse<String> res = httpClient.send(b.build(), HttpResponse.BodyHandlers.ofString());
        return requireStatus(res, expected);
    }

    private void postJson(String path, Object body, int expected, String bearer, boolean discard) throws Exception {
        HttpRequest.Builder b = HttpRequest.newBuilder()
                .uri(uri(path))
                .header("Content-Type", HDR_JSON)
                .timeout(REQ_TIMEOUT)
                .POST(HttpRequest.BodyPublishers.ofString(writeJson(body)));
        if (bearer != null)
            b.header("Authorization", "Bearer " + bearer);
        HttpResponse<Void> res = httpClient.send(b.build(), HttpResponse.BodyHandlers.discarding());
        if (res.statusCode() != expected)
            throw new HttpProblem(res.statusCode(), "<no body>");
    }

    private void putJson(String path, Object body, int expected, String bearer) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(uri(path))
                .header("Authorization", "Bearer " + bearer)
                .header("Content-Type", HDR_JSON)
                .timeout(REQ_TIMEOUT)
                .PUT(HttpRequest.BodyPublishers.ofString(writeJson(body)))
                .build();
        HttpResponse<Void> res = httpClient.send(req, HttpResponse.BodyHandlers.discarding());
        if (res.statusCode() != expected)
            throw new HttpProblem(res.statusCode(), "<no body>");
    }

    private Map<String, Object> postForm(String path, Map<String, String> form, int expected) throws Exception {
        String encoded = buildForm(form);
        HttpRequest req = HttpRequest.newBuilder()
                .uri(uri(path))
                .header("Content-Type", HDR_FORM)
                .timeout(REQ_TIMEOUT)
                .POST(HttpRequest.BodyPublishers.ofString(encoded))
                .build();
        HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        return requireStatus(res, expected);
    }

    private Map<String, Object> requireStatus(HttpResponse<String> res, int expected) {
        int code = res.statusCode();
        if (code == expected) {
            return safeParse(res.body());
        }
        String body = res.body();
        log.debug("HTTP {} != {}, body: {}", code, expected, truncate(body));
        throw new HttpProblem(code, body);
    }

    // ============================
    // JSON / JWT / Utils
    // ============================

    private <T> T parse(String json, TypeReference<T> type) {
        try {
            return objectMapper.readValue(json, type);
        } catch (Exception e) {
            throw new RuntimeException("JSON parse error: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> safeParse(String json) {
        try {
            if (json == null || json.isBlank())
                return Map.of();
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {
            });
        } catch (Exception e) {
            return Map.of("raw", json);
        }
    }

    private String writeJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("JSON write error: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> decodeJwtClaims(String jwt) {
        String[] parts = Optional.ofNullable(jwt).orElse("").split("\\.");
        if (parts.length != 3)
            throw new IllegalArgumentException("Invalid JWT token format");
        String payload = new String(Base64.getUrlDecoder().decode(padBase64(parts[1])));
        return parse(payload, new TypeReference<Map<String, Object>>() {
        });
    }

    private static String padBase64(String s) {
        int rem = s.length() % 4;
        if (rem == 2)
            return s + "==";
        if (rem == 3)
            return s + "=";
        if (rem == 1)
            throw new IllegalArgumentException("Bad base64url payload length");
        return s;
    }

    private static Number asNumber(Object o, Number def) {
        return (o instanceof Number n) ? n : def;
    }

    private static String enc(String v) {
        return URLEncoder.encode(v, StandardCharsets.UTF_8);
    }

    private static String buildForm(Map<String, String> kv) {
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, String> e : kv.entrySet()) {
            if (e.getKey() == null || e.getValue() == null)
                continue;
            if (!first)
                sb.append('&');
            first = false;
            sb.append(enc(e.getKey())).append('=').append(enc(e.getValue()));
        }
        return sb.toString();
    }

    private String realmPath(String suffix) {
        // normalized to "/realms/{realm}{suffix}"
        if (!suffix.startsWith("/"))
            suffix = "/" + suffix;
        return "/realms/" + realm + suffix;
    }

    private String adminPath(String suffix) {
        if (!suffix.startsWith("/"))
            suffix = "/" + suffix;
        return "/admin/realms/" + realm + suffix;
    }

    private URI uri(String path) {
        if (!path.startsWith("/"))
            path = "/" + path;
        return URI.create(keycloakBaseUrl + path);
    }

    private static String stripTrailingSlash(String s) {
        if (s == null)
            return null;
        return s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }

    private static String truncate(String s) {
        if (s == null)
            return null;
        if (s.length() <= LOG_BODY_TRUNCATE)
            return s;
        return s.substring(0, LOG_BODY_TRUNCATE) + "...(truncated)";
    }

    /**
     * Extract detailed error information from Keycloak response body
     */
    private KeycloakErrorDetails extractKeycloakErrorDetails(String body) {
        try {
            if (body == null || body.trim().isEmpty()) {
                return new KeycloakErrorDetails(null, null, body);
            }

            Map<String, Object> errorMap = safeParse(body);
            String error = (String) errorMap.get("error");
            String errorDescription = (String) errorMap.get("error_description");
            String errorMessage = (String) errorMap.get("message");

            // Use error_description if available, otherwise use message, otherwise use error
            String description = errorDescription != null ? errorDescription :
                                (errorMessage != null ? errorMessage : error);

            return new KeycloakErrorDetails(error, description, body);
        } catch (Exception e) {
            // If JSON parsing fails, try the simple extraction as fallback
            String simpleError = extractKeycloakErrorSimple(body);
            return new KeycloakErrorDetails(simpleError, simpleError, body);
        }
    }

    /**
     * Simple error extraction as fallback when JSON parsing fails
     */
    private static String extractKeycloakErrorSimple(String body) {
        try {
            if (body == null)
                return null;
            String trimmed = body.trim();
            if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
                int i = trimmed.indexOf("\"error\"");
                if (i >= 0) {
                    int colon = trimmed.indexOf(':', i);
                    if (colon > 0) {
                        String rest = trimmed.substring(colon + 1).trim();
                        if (rest.startsWith("\"")) {
                            int end = rest.indexOf('"', 1);
                            if (end > 1)
                                return rest.substring(1, end);
                        }
                    }
                }
            }
            return null;
        } catch (Exception ignore) {
            return null;
        }
    }

    /**
     * Class to hold detailed Keycloak error information
     */
    private static class KeycloakErrorDetails {
        private final String errorCode;
        private final String errorDescription;
        private final String rawResponse;

        public KeycloakErrorDetails(String errorCode, String errorDescription, String rawResponse) {
            this.errorCode = errorCode;
            this.errorDescription = errorDescription;
            this.rawResponse = rawResponse;
        }

        public String getErrorCode() {
            return errorCode;
        }

        public String getErrorDescription() {
            return errorDescription;
        }

        public String getRawResponse() {
            return rawResponse;
        }

        public String getDisplayMessage() {
            // Return the most descriptive message available
            if (errorDescription != null && !errorDescription.trim().isEmpty()) {
                return errorDescription;
            }
            if (errorCode != null && !errorCode.trim().isEmpty()) {
                return errorCode;
            }
            return "Unknown error occurred";
        }
    }

    // Lightweight exception to carry HTTP detail
    private static class HttpProblem extends RuntimeException {
        private final int status;
        private final String body;

        HttpProblem(int status, String body) {
            super("HTTP " + status);
            this.status = status;
            this.body = body;
        }

        int status() {
            return status;
        }

        String body() {
            return body;
        }
    }
}
