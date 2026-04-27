import React, { memo } from 'react';
import ColorPopup from './ColorPopup';

function TextColorPopup({ onTextColor, onClose }) {
  return (
    <ColorPopup
      open={true}
      onSelectColor={color => {
        onTextColor?.(color);
        onClose?.();
      }}
    />
  );
}

export default memo(TextColorPopup);
