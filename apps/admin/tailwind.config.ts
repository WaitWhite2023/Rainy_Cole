import preset from '../../packages/config/tailwind/preset';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4f6ef7',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
        neutral: {
          0: '#ffffff',
          50: '#f8f9fc',
          100: '#f0f1f5',
          200: '#e4e6ee',
          300: '#d1d5dd',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      }
    }
  }
};
