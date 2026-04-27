export function getEditorStyle(editorTheme = {}) {
  return {
    '--editor-border-color': editorTheme.borderColor,
    '--editor-radius': editorTheme.borderRadius ? `${editorTheme.borderRadius}px` : undefined,
    '--editor-bg': editorTheme.background,

    '--Editor-merge-tag-bg': editorTheme.mergeTagBg,
    '--Editor-merge-tag-color': editorTheme.mergeTagColor,
    '--Editor-merge-tag-radius': editorTheme.mergeTagRadius
      ? `${editorTheme.mergeTagRadius}px`
      : undefined,
  };
}
