import React from 'react';
import ToolbarItem from '../toolbar/ToolbarRenderItem';

export default function MorePopup({ overflowKeys, itemProps, openPopup, onClose }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '500px',
        flexWrap: 'wrap',
      }}
    >
      {overflowKeys.map(key => (
        <div
          key={key}
          //   onClick={onClose}
        >
          <ToolbarItem itemKey={key} insideMore {...itemProps} openPopup={openPopup} />
        </div>
      ))}
    </div>
  );
}
