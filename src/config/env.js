// src/config/env.js

/**
 * Environment configuration for the application
 * In production, these should be stored as environment variables
 */

export const ENV_CONFIG = {
  // Cloudinary Configuration
  CLOUDINARY: {
    CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djf1fggtn',
    API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY || '275898188196713',
    API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET || 'N2VdvB78fVgXKJaLW9119HJOAyU',
    UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Freemium_Novels'
  },

  // Firebase Configuration (already configured in firebase/config.js)
  FIREBASE: {
    API_KEY: "AIzaSyBCcQ-Bm7Cfw8TFUePvYCcOlVjHoTz21ME",
    AUTH_DOMAIN: "freemium-novel-app.firebaseapp.com",
    PROJECT_ID: "freemium-novel-app",
    STORAGE_BUCKET: "freemium-novel-app.firebasestorage.app",
    MESSAGING_SENDER_ID: "62996163666",
    APP_ID: "1:62996163666:web:baf391fef780aa57d8838b",
    MEASUREMENT_ID: "G-20MDS57WMW"
  }
};

// Helper function to check if all required environment variables are set
export const validateEnvironment = () => {
  const requiredVars = [
    'CLOUDINARY.CLOUD_NAME',
    'CLOUDINARY.API_KEY'
  ];

  const missing = requiredVars.filter(varPath => {
    const [section, key] = varPath.split('.');
    return !ENV_CONFIG[section][key];
  });

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }

  return missing.length === 0;
};

export default ENV_CONFIG; 