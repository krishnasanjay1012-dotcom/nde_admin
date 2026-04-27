import React, { useState, useRef, useEffect } from 'react';
import { colorOptions } from '../../utils/OtherData';
import Styles from '../../styles/Other.module.css';

export default function ColorPopup({ open, onSelectColor, onClose }) {
  const popupRef = useRef(null);

  const [customColor, setCustomColor] = useState('#000000');

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  return (
    <div className={Styles.innerPopup}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {colorOptions.map(color => (
          <div
            key={color}
            onClick={() => onSelectColor(color)}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: color,
              cursor: 'pointer',
              border: '1px solid #ccc',
            }}
          />
        ))}
      </div>
      <div className={Styles.popupDivider} />
      <div className={Styles.customRow}>
        <span className={Styles.popupLabel}>Custom</span>

        <div className={Styles.customActions}>
          <input
            type="color"
            value={customColor}
            onChange={e => setCustomColor(e.target.value)}
            className={Styles.colorInput}
          />

          <button type="button" onClick={() => onSelectColor(customColor)} className={Styles.okBtn}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
