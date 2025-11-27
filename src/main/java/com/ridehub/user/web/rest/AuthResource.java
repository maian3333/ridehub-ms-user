package com.ridehub.user.web.rest;

import com.ridehub.user.service.KeycloakAuthService;
import com.ridehub.user.service.dto.auth.SendOtpRequestDTO;
import com.ridehub.user.service.dto.auth.SendOtpResponseDTO;
import com.ridehub.user.service.dto.auth.UpdateProfileRequest;
import com.ridehub.user.service.dto.auth.VerifyOtpRequestDTO;
import com.ridehub.user.service.dto.auth.VerifyOtpResponseDTO;

// import io.swagger.v3.oas.annotations.parameters.RequestBody
import com.ridehub.user.service.dto.auth.RegistrationCompleteRequestDTO;
import com.ridehub.user.service.dto.auth.RegistrationCompleteResponseDTO;
import com.ridehub.user.service.dto.auth.PasswordResetRequestDTO;
import com.ridehub.user.service.dto.auth.AdminUpdatePasswordRequest;
import com.ridehub.user.service.dto.auth.AdminUpdateUserRequest;
import com.ridehub.user.service.dto.auth.CreateAdminRequest;
import com.ridehub.user.service.dto.auth.LoginRequestDTO;
import com.ridehub.user.service.dto.auth.LoginResponseDTO;
import jakarta.validation.Valid;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication operations.
 * Provides frontend-friendly APIs that proxy to Keycloak SPI endpoints.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthResource {

    private static final Logger log = LoggerFactory.getLogger(AuthResource.class);

    private final KeycloakAuthService keycloakAuthService;

    public AuthResource(KeycloakAuthService keycloakAuthService) {
        this.keycloakAuthService = keycloakAuthService;
    }

    /**
     * POST /api/auth/register/send-otp : Send OTP for registration
     *
     * @param request the phone number request
     * @return the ResponseEntity with status 200 (OK) and OTP send response,
     *         or with status 400 (Bad Request) if the phone number is invalid
     */
    @PostMapping("/register/send-otp")
    public ResponseEntity<SendOtpResponseDTO> sendRegistrationOtp(@Valid @RequestBody SendOtpRequestDTO request) {
        log.debug("REST request to send registration OTP to phone: {}", request.getPhone());

        SendOtpResponseDTO response = keycloakAuthService.sendRegistrationOtp(request.getPhone());

        if (response.getTxnId() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * POST /api/auth/register/verify-otp : Verify OTP for registration
     *
     * @param request the OTP verification request
     * @return the ResponseEntity with status 200 (OK) and verification response,
     *         or with status 400 (Bad Request) if the OTP is invalid
     */
    @PostMapping("/register/verify-otp")
    public ResponseEntity<VerifyOtpResponseDTO> verifyRegistrationOtp(@Valid @RequestBody VerifyOtpRequestDTO request) {
        log.debug("REST request to verify registration OTP for txnId: {}", request.getTxnId());

        VerifyOtpResponseDTO response = keycloakAuthService.verifyRegistrationOtp(request.getTxnId(),
                request.getCode());

        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * POST /api/auth/register/complete : Complete user registration
     *
     * @param request the registration completion request
     * @return the ResponseEntity with status 201 (Created) and registration
     *         response,
     *         or with status 400 (Bad Request) if the registration data is invalid,
     *         or with status 409 (Conflict) if the user already exists
     */
    @PostMapping("/register/complete")
    public ResponseEntity<RegistrationCompleteResponseDTO> completeRegistration(
            @Valid @RequestBody RegistrationCompleteRequestDTO request) {
        log.debug("REST request to complete registration for user: {} {}", request.getFirstName(),
                request.getLastName());

        RegistrationCompleteResponseDTO response = keycloakAuthService.completeRegistration(
                request.getRegToken(),
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                request.getPassword());

        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            if (response.getMessage().contains("already registered")
                    || response.getMessage().contains("phone_exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * POST /api/auth/password-reset/request : Request password reset OTP
     *
     * @param request the phone number request
     * @return the ResponseEntity with status 200 (OK) and OTP send response,
     *         or with status 400 (Bad Request) if the phone number is invalid
     */
    @PostMapping("/password-reset/request")
    public ResponseEntity<SendOtpResponseDTO> requestPasswordReset(@Valid @RequestBody SendOtpRequestDTO request) {
        log.debug("REST request to send password reset OTP to phone: {}", request.getPhone());

        SendOtpResponseDTO response = keycloakAuthService.requestPasswordReset(request.getPhone());

        if (response.getTxnId() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * POST /api/auth/password-reset/verify-otp : Verify OTP for password reset
     *
     * @param request the OTP verification request
     * @return the ResponseEntity with status 200 (OK) and verification response,
     *         or with status 400 (Bad Request) if the OTP is invalid
     */
    @PostMapping("/password-reset/verify-otp")
    public ResponseEntity<VerifyOtpResponseDTO> verifyPasswordResetOtp(
            @Valid @RequestBody VerifyOtpRequestDTO request) {
        log.debug("REST request to verify password reset OTP for txnId: {}", request.getTxnId());

        VerifyOtpResponseDTO response = keycloakAuthService.verifyPasswordResetOtp(request.getTxnId(),
                request.getCode());

        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * POST /api/auth/password-reset/complete : Complete password reset
     *
     * @param request the password reset completion request
     * @return the ResponseEntity with status 200 (OK) and reset response,
     *         or with status 400 (Bad Request) if the reset data is invalid,
     *         or with status 404 (Not Found) if the user is not found
     */
    @PostMapping("/password-reset/complete")
    public ResponseEntity<Map<String, Object>> completePasswordReset(
            @Valid @RequestBody PasswordResetRequestDTO request) {
        log.debug("REST request to complete password reset");

        Map<String, Object> response = keycloakAuthService.completePasswordReset(request.getResetToken(),
                request.getNewPassword());

        String status = (String) response.get("status");
        if ("success".equals(status)) {
            return ResponseEntity.ok(response);
        } else {
            String message = (String) response.get("message");
            if (message.contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * POST /api/auth/login : Login user with username and password
     *
     * @param request the login request with username and password
     * @return the ResponseEntity with status 200 (OK) and login response with
     *         tokens,
     *         or with status 401 (Unauthorized) if credentials are invalid
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        log.debug("REST request to login user: {}", request.getUsername());

        LoginResponseDTO response = keycloakAuthService.login(request.getUsername(), request.getPassword());

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // --- Refresh Token ---
    @PostMapping(value = "/refresh", consumes = { MediaType.TEXT_PLAIN_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<LoginResponseDTO> refreshToken(@RequestBody String refreshToken) {
        refreshToken = refreshToken == null ? "" : refreshToken.trim();

        if (refreshToken.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(LoginResponseDTO.error("Refresh token is required"));
        }

        LoginResponseDTO response = keycloakAuthService.refreshToken(refreshToken);

        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // --- Logout ---
    @PostMapping(value = "/logout", consumes = { MediaType.TEXT_PLAIN_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Map<String, Object>> logout(@RequestBody String refreshToken) {
        refreshToken = refreshToken == null ? "" : refreshToken.trim();

        if (refreshToken.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("status", "error", "message", "Refresh token is required"));
        }

        Map<String, Object> response = keycloakAuthService.logout(refreshToken);

        return "success".equals(response.get("status"))
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    /**
     * GET /api/auth/health : Health check for authentication service
     *
     * @return the ResponseEntity with status 200 (OK) and health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "auth-service",
                "keycloak", "connected"));
    }

    @PostMapping("/create")
    // @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')") // or your own guard
    public ResponseEntity<?> create(@RequestBody CreateAdminRequest req) {
        return ResponseEntity.ok(keycloakAuthService.createAdminUser(req));
    }

    @PutMapping("/{keycloak_id}")
    public ResponseEntity<?> updateDetails(
            @PathVariable String keycloak_id,
            @RequestBody AdminUpdateUserRequest req) {
        return ResponseEntity.ok(keycloakAuthService.adminUpdateUserDetails(keycloak_id, req));
    }

    @PutMapping("/{keycloak_id}/password")
    public ResponseEntity<?> updatePassword(
            @PathVariable String keycloak_id,
            @RequestBody AdminUpdatePasswordRequest req) {
        return ResponseEntity.ok(keycloakAuthService.adminUpdateUserPassword(keycloak_id, req));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("Authorization") String authorization,
            @RequestBody UpdateProfileRequest req) {
        // Expect "Bearer <token>"
        String token = authorization != null && authorization.startsWith("Bearer ")
                ? authorization.substring("Bearer ".length()).trim()
                : authorization;

        Map<String, Object> res = keycloakAuthService.updateCurrentUserProfile(token, req);
        if ("success".equals(res.get("status"))) {
            return ResponseEntity.ok(res);
        }
        return ResponseEntity.badRequest().body(res);
    }
}
