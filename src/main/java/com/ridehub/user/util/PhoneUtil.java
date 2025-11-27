package com.ridehub.user.util;

/**
 * Utility class for phone number normalization.
 * This should match the normalization logic used in the Keycloak SPI.
 */
public final class PhoneUtil {
    
    private PhoneUtil() {
        // Utility class
    }
    
    /**
     * Normalize phone number to match Keycloak SPI format.
     * This method replicates the logic from the Keycloak CustomRegResource.
     * 
     * @param raw the raw phone number input
     * @return normalized phone number or null if invalid
     */
    public static String normalizePhone(String raw) {
        if (raw == null) return null;
        
        // Remove all whitespace
        String p = raw.replaceAll("\\s+", "");
        
        // Validate format: optional + followed by 8-15 digits
        if (!p.matches("^\\+?\\d{8,15}$")) return null;
        
        // Convert Vietnamese local format to international format
        // 0123456789 -> +84123456789
        return p.startsWith("0") ? "+84" + p.substring(1) : p;
    }
    
    /**
     * Check if the input looks like a phone number (for login username detection)
     * 
     * @param input the input string
     * @return true if it looks like a phone number
     */
    public static boolean looksLikePhoneNumber(String input) {
        if (input == null) return false;
        
        // Remove whitespace for checking
        String cleaned = input.replaceAll("\\s+", "");
        
        // Check if it matches phone number pattern
        return cleaned.matches("^(\\+?\\d{8,15}|0\\d{8,14})$");
    }
}
