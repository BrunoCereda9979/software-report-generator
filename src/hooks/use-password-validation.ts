import { useState } from 'react';

interface PasswordValidation {
    isValid: boolean;
    errors: string[];
}

export const usePasswordValidation = () => {
    const validatePassword = (password: string, confirmPassword?: string): PasswordValidation => {
        const errors: string[] = [];

        // Minimum length check
        if (password.length < 12) {
            errors.push('Password must be at least 12 characters long');
        }

        // Uppercase letter check
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        // Lowercase letter check
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        // Number check
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        // Special character check
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        // Confirm password check (if provided)
        if (confirmPassword && password !== confirmPassword) {
            errors.push('Passwords do not match');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    return { validatePassword };
};