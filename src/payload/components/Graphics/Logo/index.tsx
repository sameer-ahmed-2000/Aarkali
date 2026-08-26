import React from 'react'

export const Logo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
    <span
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.8rem',
        fontWeight: 700,
        fontStyle: 'italic',
        color: '#e09874',
        background: 'linear-gradient(135deg, #e09874 0%, #f3c299 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
      }}
    >
      𝒜
    </span>
    <span
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: '0.03em',
      }}
    >
      Aarkali Boutique
    </span>
  </div>
)
