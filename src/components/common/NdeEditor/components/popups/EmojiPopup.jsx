import React, { memo } from 'react';
import EmojiPicker from 'emoji-picker-react';

function EmojiPopup({ handleEmojiClick }) {
  return <EmojiPicker onEmojiClick={handleEmojiClick} />;
}

export default memo(EmojiPopup);
