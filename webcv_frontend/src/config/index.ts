export const API_URL = import.meta.env.VITE_API_URL;

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.viettelsoftware.com',
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      CHANGE_PASSWORD: '/auth/changepass',
    },
    FORGOT: {
      CHECK_EMAIL: '/forgot/checkmail',
      CHECK_OTP: '/forgot/checkotp',
      RESET_PASSWORD: '/forgot/resetpassword',
    },

    /** ...Update later... */
    USER: {
      PROFILE: '/users/profile',
      UPDATE: '/users/profile',
    },
    ADMIN: {
        DASH_BOARD: '/admin/dashboard',
        RECENT_ACTIVITIES: '/admin/dashboard/recent-activities',
        STATUS: '/admin/system/status',
        EXPORT_CV_INFO: '/admin/export/cvs',
    },
    CV: {
      LIST: '/cv/list',
      CREATE: '/cv/create',
      UPDATE: '/cv/update',
      DELETE: '/cv/delete',
      DETAIL: '/cv/detail',
    },
  },
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'VTIT Recruitment Portal',
  COMPANY_NAME: 'Viettel Software',
  DEFAULT_LANGUAGE: 'vi' as const,
  SUPPORTED_LANGUAGES: ['vi', 'en'] as const,
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  LANGUAGE: 'language',
};