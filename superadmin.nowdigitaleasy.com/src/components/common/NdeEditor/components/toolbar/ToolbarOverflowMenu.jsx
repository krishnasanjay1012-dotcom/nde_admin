import React, { useRef } from 'react';
import DROPDOWN_SVG from '../../Assets/dropdown.svg';
import Styles from '../../styles/Toolbar.module.css';

export default function ToolbarOverflowMenu({
  overflowKeys,
  openPopup,

  ...itemProps
}) {
  const wrapperRef = useRef(null);

  if (!overflowKeys.length) return null;

  return (
    <div ref={wrapperRef} className={Styles['squire-more-wrapper']}>
      <button
        type="button"
        className={`${Styles['squire-btn']} ${Styles['squire-more-btn']}`}
        onClick={e =>
          openPopup('more', e, {
            overflowKeys,
            itemProps,
          })
        }
      >
        <img
          src={DROPDOWN_SVG}
          alt="More"
          draggable={false}
          className={Styles['squire-btn-icon']}
        />
      </button>
    </div>
  );
}
