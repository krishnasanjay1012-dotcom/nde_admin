import React, { useState } from 'react';
import { FONT_SIZES } from '../utils/OtherData';
import styles from '../styles/Toolbar.module.css';

export function FontSizeControl({ value, onChange, disabled }) {
  const initialSize = FONT_SIZES.includes(value) ? value : '14px';
  const [size, setSize] = useState(initialSize);

  const currentIndex = FONT_SIZES.indexOf(size);

  const handleIncrease = () => {
    if (currentIndex < FONT_SIZES.length - 1) {
      const newSize = FONT_SIZES[currentIndex + 1];
      setSize(newSize);
      onChange(newSize);
    }
  };

  const handleDecrease = () => {
    if (currentIndex > 0) {
      const newSize = FONT_SIZES[currentIndex - 1];
      setSize(newSize);
      onChange(newSize);
    }
  };

  const handleInputChange = e => {
    const val = e.target.value;
    if (FONT_SIZES.includes(val)) {
      setSize(val);
      onChange(val);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
      className={styles['squire-btn']}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || currentIndex <= 0}
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        -
      </button>

      <input
        type="text"
        value={size}
        onChange={handleInputChange}
        disabled={disabled}
        style={{
          width: 50,
          textAlign: 'center',
          border: 'none',
          borderRadius: 4,
          height: 24,
          fontSize: 14,
          background: 'inherit',
          outline: 'none',
          cursor: 'default',
          caretColor: 'transparent',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        list="font-sizes"
      />

      {/* <datalist id="font-sizes">
        {FONT_SIZES.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist> */}

      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || currentIndex >= FONT_SIZES.length - 1}
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        +
      </button>
    </div>
  );
}
