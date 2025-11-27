package com.ridehub.user.service.dto.auth;

import java.time.Instant;

/**
 * DTO for user login response
 */
public class LoginResponseDTO {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private String scope;
    private boolean success;
    private String message;
    private UserInfoDTO userInfo;
    private String errorCode;
    private String errorDescription;

    // Constructors
    public LoginResponseDTO() {}

    public LoginResponseDTO(String accessToken, String refreshToken, String tokenType, long expiresIn) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.success = true;
        this.message = "Login successful";
    }

    // Static factory methods
    public static LoginResponseDTO success(String accessToken, String refreshToken, String tokenType, long expiresIn) {
        return new LoginResponseDTO(accessToken, refreshToken, tokenType, expiresIn);
    }

    public static LoginResponseDTO error(String message) {
        LoginResponseDTO response = new LoginResponseDTO();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    public static LoginResponseDTO error(String message, String errorCode, String errorDescription) {
        LoginResponseDTO response = new LoginResponseDTO();
        response.setSuccess(false);
        response.setMessage(message);
        response.setErrorCode(errorCode);
        response.setErrorDescription(errorDescription);
        return response;
    }

    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserInfoDTO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfoDTO userInfo) {
        this.userInfo = userInfo;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorDescription() {
        return errorDescription;
    }

    public void setErrorDescription(String errorDescription) {
        this.errorDescription = errorDescription;
    }

    @Override
    public String toString() {
        return "LoginResponseDTO{" +
            "accessToken='***'" + // Don't log the actual token for security
            ", refreshToken='***'" + // Don't log the actual token for security
            ", tokenType='" + tokenType + '\'' +
            ", expiresIn=" + expiresIn +
            ", scope='" + scope + '\'' +
            ", success=" + success +
            ", message='" + message + '\'' +
            ", userInfo=" + userInfo +
            ", errorCode='" + errorCode + '\'' +
            ", errorDescription='" + errorDescription + '\'' +
            '}';
    }

    /**
     * Nested DTO for user information
     */
    public static class UserInfoDTO {
        private String keycloakId;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String phoneNumber;
        private boolean emailVerified;
        private boolean phoneVerified;
        private Instant lastLogin;

        // Constructors
        public UserInfoDTO() {}

        // Getters and Setters
        public String getKeycloakId() {
            return keycloakId;
        }

        public void setKeycloakId(String keycloakId) {
            this.keycloakId = keycloakId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public boolean isEmailVerified() {
            return emailVerified;
        }

        public void setEmailVerified(boolean emailVerified) {
            this.emailVerified = emailVerified;
        }

        public boolean isPhoneVerified() {
            return phoneVerified;
        }

        public void setPhoneVerified(boolean phoneVerified) {
            this.phoneVerified = phoneVerified;
        }

        public Instant getLastLogin() {
            return lastLogin;
        }

        public void setLastLogin(Instant lastLogin) {
            this.lastLogin = lastLogin;
        }

        @Override
        public String toString() {
            return "UserInfoDTO{" +
                "keycloakId='" + keycloakId + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", emailVerified=" + emailVerified +
                ", phoneVerified=" + phoneVerified +
                ", lastLogin=" + lastLogin +
                '}';
        }
    }
}
