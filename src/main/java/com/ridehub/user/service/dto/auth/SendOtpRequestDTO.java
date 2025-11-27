package com.ridehub.user.service.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for sending OTP to phone number
 */
public class SendOtpRequestDTO {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    private String phone;

    // Constructors
    public SendOtpRequestDTO() {}

    public SendOtpRequestDTO(String phone) {
        this.phone = phone;
    }

    // Getters and Setters
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return "SendOtpRequestDTO{" +
            "phone='" + phone + '\'' +
            '}';
    }
}
