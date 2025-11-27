package com.ridehub.user.service.dto.auth;


public record UpdateProfileRequest(
        String email,
        String firstName,
        String lastName,
        String phoneNumber) {
}
