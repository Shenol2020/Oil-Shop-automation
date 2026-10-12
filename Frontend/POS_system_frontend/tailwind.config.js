// tailwind.config.js – High‑Velocity POS Design System
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F3F4F6',        // background canvas
        surface: '#FFFFFF',       // cards / cart panels
        foreground: '#111827',    // primary text
        secondary: '#4B5563',     // secondary text
        primary: '#10B981',       // success – green
        destructive: '#EF4444',   // destructive – red
        accent: '#3B82F6',        // navigation – blue
        warning: '#F59E0B',       // low‑stock / alerts – amber
        border: '#E5E7EB',        // subtle borders
      },
      fontFamily: {
        headline: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],   // 12 px
        sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14 px
        base: ['1rem', { lineHeight: '1.5rem' }],   // 16 px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18 px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],  // 20 px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 24 px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30 px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36 px
        '5xl': ['3rem', { lineHeight: '1' }],        // 48 px (grand total)
      },
      borderRadius: {
        sm: '0.375rem', // 6 px
        md: '0.5rem',   // 8 px
        lg: '0.75rem',  // 12 px
      },
      spacing: {
        '12': '3rem',   // 48 px – minimum touch target
        '14': '3.5rem', // 56 px
        '16': '4rem',   // 64 px
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.1)',
        'card-md': '0 4px 6px rgba(0,0,0,.1)',
        'card-lg': '0 10px 15px rgba(0,0,0,.1)',
        'inner-pressed': 'inset 0 2px 4px rgba(0,0,0,.15)',
      },
    },
  },
  plugins: [],
};
