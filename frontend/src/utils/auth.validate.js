import zxcvbn from "zxcvbn";

/**
 * Authentication and Registration Validation Utilities
 */

// Regex patterns
export const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,20}$/;
export const EMAIL_REGEX = /\S+@\S+\.\S+/;
export const PHONE_REGEX = /^\d{10}$/;

// Allowed and Forbidden special characters for passwords
export const ALLOWED_SPECIALS = /[@._*-]/;
export const FORBIDDEN_SPECIALS = /[<>{}[\]()'";|\\/~!#$%^&*+=?´]/;

/**
 * Validates the registration form data
 * @param {Object} form - The form data object
 * @param {boolean} cookiesAccepted - Whether cookies are accepted
 * @returns {string|null} - Error message or null if valid
 */
export const validateRegisterForm = (form, cookiesAccepted) => {
    const trimmedUsername = form.username?.trim() || "";
    const trimmedFullName = form.full_name?.trim() || "";
    const trimmedEmail = form.email?.trim() || "";
    const trimmedPhone = form.phone?.trim() || "";

    // Username Validation
    if (!trimmedUsername) return "El nombre de usuario es obligatorio.";
    if (/^\s/.test(form.username)) return "El nombre de usuario no puede iniciar con espacio.";
    if (!USERNAME_REGEX.test(trimmedUsername))
        return "El nombre de usuario solo puede contener letras, números, puntos o guiones (3-20 caracteres).";

    // Full Name Validation
    if (!trimmedFullName) return "El nombre completo es obligatorio.";
    if (/^\s/.test(form.full_name)) return "El nombre completo no puede iniciar con espacio.";

    // Email Validation
    if (!trimmedEmail) return "El correo electrónico es obligatorio.";
    if (/^\s/.test(form.email)) return "El correo no puede iniciar con espacio.";
    if (!EMAIL_REGEX.test(trimmedEmail)) return "El correo no es válido.";

    // Phone Validation (Optional but must be valid if present)
    if (trimmedPhone && !PHONE_REGEX.test(trimmedPhone))
        return "El número de teléfono debe tener 10 dígitos.";
    if (/^\s/.test(form.phone)) return "El teléfono no puede iniciar con espacio.";

    // Password Validation
    if (!form.password) return "La contraseña es obligatoria.";
    if (/\s/.test(form.password)) return "La contraseña no puede contener espacios.";
    
    const strength = zxcvbn(form.password);
    if (strength.score < 3) return "La contraseña debe ser más fuerte (al menos nivel 3).";
    
    if (FORBIDDEN_SPECIALS.test(form.password))
        return "La contraseña contiene caracteres no permitidos.";
    if (!ALLOWED_SPECIALS.test(form.password))
        return "La contraseña debe incluir al menos un carácter especial permitido (@ . _ * -).";
    if (!/[A-Z]/.test(form.password))
        return "La contraseña debe contener al menos una letra mayúscula.";
    if (!/[a-z]/.test(form.password))
        return "La contraseña debe contener al menos una letra minúscula.";
    if (!/\d/.test(form.password))
        return "La contraseña debe contener al menos un número.";
    if (form.password.length < 8)
        return "La contraseña debe tener al menos 8 caracteres.";
    
    if (form.password !== form.confirmPassword)
        return "Las contraseñas no coinciden.";

    // Legal Validation
    if (!cookiesAccepted) return "Debes aceptar las cookies para continuar.";

    return null;
};

/**
 * Calculates password strength and individual requirement statuses
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {Object} Strength score and validation flags
 */
export const getPasswordStatus = (password, confirmPassword) => {
    if (!password) return {
        score: 0,
        valid: { upper: false, lower: false, number: false, length: false, special: false },
        match: null,
        error: null
    };

    if (FORBIDDEN_SPECIALS.test(password)) {
        return { error: "⚠️ Caracteres no permitidos" };
    }

    const result = zxcvbn(password);
    return {
        score: result.score,
        valid: {
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            length: password.length >= 8,
            special: ALLOWED_SPECIALS.test(password),
        },
        match: password === confirmPassword,
        error: null
    };
};
