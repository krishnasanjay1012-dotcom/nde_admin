import React, { memo } from 'react';
import TableSelector from '../table/Table';

function TablePopup({ onSelect }) {
  return <TableSelector onSelect={onSelect} />;
}

export default memo(TablePopup);
