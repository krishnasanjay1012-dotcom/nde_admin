import { useMemo } from 'react';
import { TOOLBAR_MODES } from '../utils/ToolbarModes';

export function useToolbarConfig(toolbarMode = 'full', toolbarConfig) {
  return useMemo(() => {
    if (Array.isArray(toolbarConfig) && toolbarConfig.length > 0) {
      return toolbarConfig;
    }

    return TOOLBAR_MODES[toolbarMode] || TOOLBAR_MODES.normal;
  }, [toolbarMode, toolbarConfig]);
}
