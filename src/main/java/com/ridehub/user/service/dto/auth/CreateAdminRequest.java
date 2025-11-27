package com.ridehub.user.service.dto.auth;

public record CreateAdminRequest(
        String username, // phone or normal username
        String email,
        String firstName,
        String lastName,
        String password,
        Boolean emailVerified,
        String phoneNumber) {
}
