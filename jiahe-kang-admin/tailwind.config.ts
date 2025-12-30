import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        jhk: {
          bg: '#F6FAFB',
          card: '#FFFFFF',
          ink: '#0F172A',
          muted: '#64748B',
          line: '#E2E8F0',
          primary: '#2563EB', // soft medical blue
          primarySoft: '#DBEAFE',
          success: '#059669', // calm green
          successSoft: '#D1FAE5',
          warn: '#D97706',
          warnSoft: '#FFEDD5',
          danger: '#DC2626',
          dangerSoft: '#FEE2E2',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 132, 199, 0.08)',
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 6px 18px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
} satisfies Config;

