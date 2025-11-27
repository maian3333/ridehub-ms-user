package com.ridehub.user.service.dto.auth;

// Admin đặt lại mật khẩu cho user
public record AdminUpdatePasswordRequest(
        String newPassword,
        boolean temporary // true = bắt đổi khi đăng nhập lần sau
) {
}
