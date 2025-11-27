package com.ridehub.user.service.dto.auth;

/**
 * DTO for OTP verification response
 */
public class VerifyOtpResponseDTO {

    private String token; // regToken or resetToken
    private long expiresIn;
    private String message;
    private String tokenType; // "registration" or "reset"
    private String errorCode;
    private String errorDescription;

    // Constructors
    public VerifyOtpResponseDTO() {}

    public VerifyOtpResponseDTO(String token, long expiresIn, String tokenType) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.tokenType = tokenType;
        this.message = "OTP verified successfully";
    }

    // Static factory methods
    public static VerifyOtpResponseDTO registrationToken(String regToken, long expiresIn) {
        return new VerifyOtpResponseDTO(regToken, expiresIn, "registration");
    }

    public static VerifyOtpResponseDTO resetToken(String resetToken, long expiresIn) {
        return new VerifyOtpResponseDTO(resetToken, expiresIn, "reset");
    }

    public static VerifyOtpResponseDTO error(String message) {
        VerifyOtpResponseDTO response = new VerifyOtpResponseDTO();
        response.setMessage(message);
        return response;
    }

    public static VerifyOtpResponseDTO error(String message, String errorCode, String errorDescription) {
        VerifyOtpResponseDTO response = new VerifyOtpResponseDTO();
        response.setMessage(message);
        response.setErrorCode(errorCode);
        response.setErrorDescription(errorDescription);
        return response;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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
        return "VerifyOtpResponseDTO{" +
            "token='***'" + // Don't log the actual token for security
            ", expiresIn=" + expiresIn +
            ", message='" + message + '\'' +
            ", tokenType='" + tokenType + '\'' +
            ", errorCode='" + errorCode + '\'' +
            ", errorDescription='" + errorDescription + '\'' +
            '}';
    }
}
