package com.ridehub.user.service.dto.auth;

// Cập nhật thông tin user (admin)
public record AdminUpdateUserRequest(
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        Boolean enabled,
        Boolean emailVerified) {
}