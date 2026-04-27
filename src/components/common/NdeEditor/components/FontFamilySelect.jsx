import React from 'react';
import Styles from '../styles/Toolbar.module.css';

export function FontFamilySelect({ value, options, onChange, disabled }) {
  return (
    <select
      className={Styles['squire-btn']}
      value={value || ''}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '4px 8px',
        fontSize: 14,
        borderRadius: 6,
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        minWidth: 100,
      }}
    >
      <option value="">{`Font`}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
