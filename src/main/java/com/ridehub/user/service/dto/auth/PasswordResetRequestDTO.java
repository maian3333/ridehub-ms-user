package com.ridehub.user.service.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for password reset completion
 */
public class PasswordResetRequestDTO {

    @NotBlank(message = "Reset token is required")
    private String resetToken;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String newPassword;

    // Constructors
    public PasswordResetRequestDTO() {}

    public PasswordResetRequestDTO(String resetToken, String newPassword) {
        this.resetToken = resetToken;
        this.newPassword = newPassword;
    }

    // Getters and Setters
    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    @Override
    public String toString() {
        return "PasswordResetRequestDTO{" +
            "resetToken='***'" + // Don't log the actual token for security
            ", newPassword='***'" + // Don't log the actual password for security
            '}';
    }
}
