import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Styles from '../styles/Other.module.css';
import { useClickOutside } from '../hooks/useClickOutside';
import EmojiPopup from './popups/EmojiPopup';
import HighlightColorPopup from './popups/HighlightColorPopup';
import TextColorPopup from './popups/TextColorPopup';
import ImagePopup from './popups/ImagePopup';
import LinkPopup from './popups/LinkPopup';
import TablePopup from './table/TablePopup';
import MorePopup from './popups/MorePopup';

export default function Popups({
  popup,
  onClose,
  toolbarPosition,
  onSelectTable,
  onInsertLink,
  onInsertImageByUrl,
  onInsertImageByFile,
  onTextColor,
  onHighlightColor,
  handleEmojiClick,
  openPopup,
}) {
  const popupRef = useRef(null);
  const [popupSize, setPopupSize] = useState({ width: 0, height: 0 });

  useClickOutside(popupRef, onClose);

  useLayoutEffect(() => {
    if (popup.open && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setPopupSize({ width: rect.width, height: rect.height });
    }
  }, [popup.open, popup.type]);

  const position = useMemo(() => {
    if (!popup.anchorRect || !popup.wrapperRect) return { top: 0, left: 0 };

    const gap = 10;

    const wrapperRect = popup.wrapperRect;
    const anchorRect = popup.anchorRect;

    const popupWidth = popupSize.width || 320;
    const popupHeight = popupSize.height || 200;

    const anchorLeft = anchorRect.left - wrapperRect.left;
    const anchorTop = anchorRect.top - wrapperRect.top;
    const anchorBottom = anchorRect.bottom - wrapperRect.top;

    let top = 0;

    if (toolbarPosition === 'top') {
      top = anchorBottom + gap + 60;
    } else {
      top = anchorTop - popupHeight - gap; // above button
    }

    let left = anchorLeft;
    const minLeft = gap;
    const maxLeft = wrapperRect.width - popupWidth - gap;

    if (left > maxLeft) left = maxLeft;
    if (left < minLeft) left = minLeft;

    return { top, left };
  }, [popup.anchorRect, popup.wrapperRect, toolbarPosition, popupSize]);

  if (!popup.open || !popup.anchorRect) return null;

  return (
    <div
      ref={popupRef}
      className={Styles.ndepopup}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 9999,
      }}
    >
      {popup.type === 'table' && (
        <TablePopup
          onSelect={(r, c) => {
            onSelectTable?.(r, c);
            onClose?.();
          }}
        />
      )}

      {popup.type === 'link' && <LinkPopup onClose={onClose} onInsertLink={onInsertLink} />}

      {popup.type === 'image' && (
        <ImagePopup
          onClose={onClose}
          onInsertImageByUrl={onInsertImageByUrl}
          onInsertImageByFile={onInsertImageByFile}
        />
      )}

      {popup.type === 'colorText' && <TextColorPopup onClose={onClose} onTextColor={onTextColor} />}

      {popup.type === 'colorHighlight' && (
        <HighlightColorPopup onClose={onClose} onHighlightColor={onHighlightColor} />
      )}

      {popup.type === 'emoji' && <EmojiPopup handleEmojiClick={handleEmojiClick} />}

      {popup.type === 'more' && (
        <MorePopup
          overflowKeys={popup.overflowKeys}
          itemProps={popup.itemProps}
          onClose={onClose}
          openPopup={openPopup}
        />
      )}
    </div>
  );
}
