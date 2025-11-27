package com.ridehub.user.service.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for verifying OTP
 */
public class VerifyOtpRequestDTO {

    @NotBlank(message = "Transaction ID is required")
    private String txnId;

    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^\\d{6}$", message = "OTP code must be 6 digits")
    private String code;

    // Constructors
    public VerifyOtpRequestDTO() {}

    public VerifyOtpRequestDTO(String txnId, String code) {
        this.txnId = txnId;
        this.code = code;
    }

    // Getters and Setters
    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "VerifyOtpRequestDTO{" +
            "txnId='" + txnId + '\'' +
            ", code='***'" + // Don't log the actual code for security
            '}';
    }
}
