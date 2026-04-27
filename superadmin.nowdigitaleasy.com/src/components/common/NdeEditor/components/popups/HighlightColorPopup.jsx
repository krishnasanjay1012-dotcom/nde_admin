import React, { memo } from 'react';
import ColorPopup from './ColorPopup';

function HighlightColorPopup({ onHighlightColor, onClose }) {
  return (
    <ColorPopup
      open={true}
      onSelectColor={color => {
        onHighlightColor?.(color);
        onClose?.();
      }}
    />
  );
}

export default memo(HighlightColorPopup);
