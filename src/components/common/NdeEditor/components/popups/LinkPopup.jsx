import React, { memo, useEffect, useState } from 'react';
import Styles from '../../styles/Other.module.css';

function LinkPopup({ onInsertLink, onClose }) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    setUrl('');
    setText('');
  }, []);

  const handleInsert = () => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    const finalText = text.trim() || cleanUrl;
    onInsertLink?.({ url: cleanUrl, text: finalText });
    onClose?.();
  };

  return (
    <div className={Styles.innerPopup}>
      <div className={Styles.popupTitle}>Insert Link</div>

      <input
        className={Styles.popupInput}
        placeholder="Text (optional)"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <input
        className={Styles.popupInput}
        placeholder="https://example.com"
        value={url}
        onChange={e => setUrl(e.target.value)}
        autoFocus
      />

      <div className={Styles.popupActions}>
        <button type="button" className={Styles.popupBtn} onClick={onClose}>
          Cancel
        </button>

        <button
          type="button"
          className={Styles.popupBtn}
          onClick={handleInsert}
          disabled={!url.trim()}
        >
          Insert
        </button>
      </div>
    </div>
  );
}

export default memo(LinkPopup);
