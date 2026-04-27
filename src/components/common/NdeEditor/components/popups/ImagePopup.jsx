import React, { memo, useState } from 'react';
import Styles from '../../styles/Other.module.css';

function ImagePopup({ onInsertImageByUrl, onInsertImageByFile, onClose }) {
  const [imageUrl, setImageUrl] = useState('');

  const handleInsertUrl = () => {
    const cleanUrl = imageUrl.trim();
    if (!cleanUrl) return;

    onInsertImageByUrl?.(cleanUrl);
    onClose?.();
  };

  return (
    <div className={Styles.innerPopup}>
      <div className={Styles.popupTitle}>Insert Image</div>

      <div className={Styles.popupSection}>
        <div className={Styles.popupLabel}>Image URL</div>

        <input
          className={Styles.popupInput}
          placeholder="https://example.com/image.png"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />

        <button
          type="button"
          className={Styles.popupBtn}
          disabled={!imageUrl.trim()}
          onClick={handleInsertUrl}
        >
          Insert by URL
        </button>
      </div>

      <div className={Styles.popupDivider} />

      <div className={Styles.popupSection}>
        <div className={Styles.popupLabel}>Upload from Computer</div>

        <div className={Styles.fileRow}>
          <label className={Styles.fileBtn}>
            Choose file
            <input
              type="file"
              accept="image/*"
              className={Styles.fileInput}
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;

                onInsertImageByFile?.(file);
                onClose?.();
              }}
            />
          </label>

          <span className={Styles.fileName}>No file chosen</span>
        </div>
      </div>
    </div>
  );
}

export default memo(ImagePopup);
