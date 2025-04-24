/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#3b82f6', // Blue 500
          dark: '#2563eb',    // Blue 600
          light: '#93c5fd',   // Blue 300
        },
        // Neutral colors for light mode
        background: '#f9fafb',      // Gray 50
        card: {
          DEFAULT: '#ffffff',       // White
          alt: '#f3f4f6',           // Gray 100
        },
        border: {
          DEFAULT: '#e5e7eb',       // Gray 200
          focus: '#3b82f6',         // Primary
        },
        text: {
          primary: '#111827',       // Gray 900
          secondary: '#6b7280',     // Gray 500
          tertiary: '#9ca3af',      // Gray 400
        },
        // Dark mode colors
        dark: {
          background: '#111827',    // Gray 900
          card: {
            DEFAULT: '#1f2937',     // Gray 800
            alt: '#374151',         // Gray 700
          },
          border: '#374151',        // Gray 700
          text: {
            primary: '#f9fafb',     // Gray 50
            secondary: '#9ca3af',   // Gray 400
            tertiary: '#6b7280',    // Gray 500
          },
        },
        // Accent colors
        success: '#10b981',         // Emerald 500
        warning: '#f59e0b',         // Amber 500
        error: '#ef4444',           // Red 500
        info: '#3b82f6',            // Blue 500
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        'xs': '0.25rem',    // 4px
        'sm': '0.5rem',     // 8px
        'md': '1rem',       // 16px
        'lg': '1.5rem',     // 24px
        'xl': '2rem',       // 32px
        '2xl': '2.5rem',    // 40px
        '3xl': '3rem',      // 48px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px - Our standard radius
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'none': 'none',
      },
      transitionProperty: {
        'DEFAULT': 'all',
      },
      transitionDuration: {
        'DEFAULT': '200ms',
        'fast': '150ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'DEFAULT': 'ease-in-out',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale': 'scale 0.2s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
        'success-gradient': 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
        'neutral-gradient': 'linear-gradient(135deg, rgba(249, 250, 251, 0.7), rgba(243, 244, 246, 0.5))',
        'dark-gradient': 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.8))',
      },
    },
  },
  plugins: [],
}
