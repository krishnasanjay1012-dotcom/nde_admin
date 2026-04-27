import React, { memo } from 'react';
import { TOOLBAR_ITEMS } from './ToolbarItems';
import { FONT_FAMILIES, FONT_SIZES } from '../../utils/OtherData';
import Styles from '../../styles/Toolbar.module.css';
import { FontFamilySelect } from '../FontFamilySelect';
import { FontSizeControl } from '../FontSizeControl';

const ToolbarRenderItem = memo(function ToolbarItem({
  itemKey,
  insideMore = false,

  mergeTags,
  handleInsertMergeTag,

  disabled,
  run,
  format,
  undoState,
  fontInfo,

  // handleLink,
  // handleInsertImage,
  // handleInsertTable,

  isPlainText,
  setIsPlainText,

  setShowEmoji,
  openPopup,
}) {
  const item = TOOLBAR_ITEMS[itemKey];
  if (!item) return null;

  // CUSTOM
  if (item.type === 'custom') {
    return item.renderCustom?.({
      mergeTags,
      handleInsertMergeTag,
      disabled,
      run,
      format,
      undoState,
      fontInfo,
      isPlainText,
      setIsPlainText,
      setShowEmoji,
      insideMore,
    });
  }

  // SELECT
  if (item.type === 'select') {
    if (item.title === 'Font Family') {
      return (
        <FontFamilySelect
          value={item.getValue?.({ fontInfo })}
          options={item.options?.({ FONT_FAMILIES }) || []}
          onChange={val => item.onChange?.({ run, value: val })}
          disabled={disabled}
        />
      );
    }

    if (item.title === 'Font Size') {
      return (
        <FontSizeControl
          value={item.getValue?.({ fontInfo })}
          options={item.options?.({ FONT_SIZES }) || []}
          onChange={val => item.onChange?.({ run, value: val })}
          disabled={disabled}
        />
      );
    }

    // fallback for any other select
    return (
      <select
        className={Styles['squire-btn']}
        disabled={disabled}
        value={item.getValue?.({ fontInfo }) || ''}
        title={item.title}
        onChange={e =>
          item.onChange({
            run,
            value: e.target.value,
          })
        }
      >
        <option value="">{item.placeholder || 'Select'}</option>
        {(item.options?.({ FONT_SIZES, FONT_FAMILIES }) || []).map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // BUTTON
  const active = item.isActive?.(format) || false;

  const isDisabled = item.disabled ? item.disabled({ disabled, format, undoState }) : disabled;

  return (
    <button
      type="button"
      className={Styles['squire-btn']}
      title={item.title}
      aria-pressed={active}
      disabled={isDisabled}
      onClick={event =>
        item.onClick({
          event,
          openPopup,
          run,
          format,
          undoState,
          disabled,
          // handleLink,
          // handleInsertImage,
          // handleInsertTable,
          isPlainText,
          setIsPlainText,
          setShowEmoji,
        })
      }
    >
      {item.render()}
    </button>
  );
});

export default ToolbarRenderItem;
