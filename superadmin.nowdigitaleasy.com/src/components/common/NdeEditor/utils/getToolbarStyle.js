export function getToolbarStyle(toolbarTheme = {}) {
  return {
    '--Editor-toolbar-bg': toolbarTheme.toolbarBg,
    '--Editor-toolbar-border-color': toolbarTheme.toolbarBorderColor,

    '--Editor-btn-size': toolbarTheme.buttonSize ? `${toolbarTheme.buttonSize}px` : undefined,

    '--Editor-icon-size': toolbarTheme.iconSize ? `${toolbarTheme.iconSize}px` : undefined,

    '--Editor-btn-radius': toolbarTheme.buttonRadius ? `${toolbarTheme.buttonRadius}px` : undefined,

    '--Editor-btn-border-color': toolbarTheme.buttonBorderColor,
    '--Editor-btn-hover-bg': toolbarTheme.buttonHoverBg,
    '--Editor-btn-hover-border-color': toolbarTheme.buttonHoverBorderColor,
  };
}
