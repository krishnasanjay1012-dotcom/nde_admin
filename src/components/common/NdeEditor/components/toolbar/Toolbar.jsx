import React, { useCallback, useMemo } from 'react';
import { TOOLBAR_ITEMS } from './ToolbarItems';
import { useToolbarConfig } from '../../hooks/useToolbarConfig';
import { useResponsiveToolbar } from '../../hooks/useResponsiveToolbar';

import ToolbarRenderItem from './ToolbarRenderItem';
import ToolbarOverflowMenu from './ToolbarOverflowMenu';

import Styles from '../../styles/Toolbar.module.css';
import { getToolbarStyle } from '../../utils/getToolbarStyle';

export default function Toolbar({
  toolbarMode = 'full',
  toolbarConfig,
  toolbarTheme = {},
  mergeTags,

  format,
  undoState,
  fontInfo,

  disabled,
  run,
  // handleLink,
  // handleInsertImage,
  // handleInsertTable,
  handleInsertMergeTag,
  openPopup,
  isPlainText,
  setIsPlainText,
}) {
  const items = useToolbarConfig(toolbarMode, toolbarConfig);
  const toolbarStyle = useMemo(() => getToolbarStyle(toolbarTheme), [toolbarTheme]);

  const getItemWidth = useCallback(key => {
    const item = TOOLBAR_ITEMS[key];
    if (!item) return 40;

    if (item.type === 'select') {
      if (key === 'fontFamily') return 170;
      if (key === 'fontSize') return 110;
      if (key === 'mergeTags') return 180;
      return 140;
    }

    if (item.type === 'custom') {
      if (key === 'emoji') return 40;
      return 120;
    }

    return 40;
  }, []);

  const { containerRef, visibleKeys, overflowKeys } = useResponsiveToolbar(items, getItemWidth);

  const sharedItemProps = {
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
    openPopup,
  };

  return (
    <div ref={containerRef} className={Styles['squire-toolbar']} style={toolbarStyle}>
      <div className={Styles['squire-toolbar-left']}>
        {visibleKeys.map(key => (
          <div key={key} className={Styles['squire-toolbar-item']}>
            <ToolbarRenderItem itemKey={key} {...sharedItemProps} />
          </div>
        ))}
      </div>

      <div className={Styles['squire-toolbar-right']}>
        <ToolbarOverflowMenu
          overflowKeys={overflowKeys}
          openPopup={openPopup}
          {...sharedItemProps}
        />
      </div>
    </div>
  );
}
