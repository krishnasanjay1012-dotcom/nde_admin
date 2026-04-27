import React, { useMemo, useRef, useState } from 'react';
import { useEditorConfig } from './hooks/useEditorConfig';
import PlainTextEditor from './components/PlainTextEditor';
import './styles/HtmlEditor.css';
import Toolbar from './components/toolbar/Toolbar';
import { getEditorStyle } from './utils/getEditorStyle';
import { ndeEditorPropTypes, ndeEditorDefaultProps } from './NdeEditor.propTypes';
import Popups from './components/Popups';

const INITIAL_POPUP = {
  open: false,
  type: null,
  anchorRect: null,
  wrapperRect: null,
  overflowKeys: [],
  itemProps: null,
};

export default function NdeEditor({
  value = '',
  initialHTML = '',
  onChange,
  placeholder = 'Write something…',
  minHeight = '200px',
  disabled = false,
  defaultFormat = {},
  toolbar,
  editorTheme = {},
  imageInsertMode = 'base64',
  uploadInlineImage,
  getImageUrl,
}) {
  const {
    containerRef,
    content,
    setContent,
    run,
    handleTextColor,
    handleHighlightColor,
    handleInsertLink,
    handleInsertImageByUrl,
    handleInsertImageByFile,
    handleInsertTable,
    handleEmojiClick,
    handleInsertMergeTag,
    format,
    fontInfo,
    undoState,
    plainText,
    isPlainText,
    setIsPlainText,
    setPlainText,
  } = useEditorConfig({
    value,
    initialHTML,
    onChange,
    placeholder,
    disabled,
    defaultFormat,
    imageInsertMode,
    uploadInlineImage,
    getImageUrl,
  });

  const textareaRef = useRef(null);
  const wrapperRef = useRef(null);
  const [popup, setPopup] = useState(INITIAL_POPUP);

  const style = useMemo(
    () => ({
      minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    }),
    [minHeight]
  );

  const editorStyle = useMemo(() => getEditorStyle(editorTheme), [editorTheme]);

  const openPopup = (type, event, extra = {}) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const wrapperRect = containerRef.current?.getBoundingClientRect();

    setPopup({
      open: true,
      type,
      anchorRect: rect,
      wrapperRect,
      ...extra,
    });
  };

  const closePopup = () => setPopup(INITIAL_POPUP);

  const renderToolbar = () => (
    <Toolbar
      run={run}
      // handleLink={handleInsertLink}
      // handleInsertImage={handleInsertImage}
      // handleInsertTable={handleInsertTable}
      handleInsertMergeTag={handleInsertMergeTag}
      format={format}
      undoState={undoState}
      fontInfo={fontInfo}
      disabled={disabled}
      isPlainText={isPlainText}
      setIsPlainText={setIsPlainText}
      openPopup={openPopup}
      toolbarMode={toolbar.type}
      toolbarConfig={toolbar.config}
      toolbarTheme={toolbar.theme}
      mergeTags={toolbar.mergeTags}
      toolbarPosition={toolbar.position}
    />
  );

  const handlePlainTextChange = e => {
    const value = e.target.value;
    setPlainText(value);
    const html = `<p>${value.replace(/\n/g, '<br>')}</p>`;
    setContent(html);
    onChange?.(value);
    // onChange?.({ html, text: value, fontInfo: {} });
  };

  return (
    <div
      ref={wrapperRef}
      className={'squire-editor-wrapper'}
      style={{ ...editorStyle, position: 'relative' }}
    >
      {toolbar.position === 'top' && renderToolbar()}
      <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
        {isPlainText ? (
          <PlainTextEditor
            textareaRef={textareaRef}
            value={plainText}
            onChange={handlePlainTextChange}
            placeholder={placeholder}
            minHeight={minHeight}
            content={content}
            isPlainText={isPlainText}
            setPlainText={setPlainText}
          />
        ) : (
          <div
            key={isPlainText ? 'plain' : 'rich'}
            ref={containerRef}
            className="squire-editor-container"
            style={style}
            // contentEditable={!disabled}
            // suppressContentEditableWarning
            data-placeholder={placeholder}
            aria-label="Rich text editor"
          />
        )}
      </div>
      {toolbar.position === 'bottom' && renderToolbar()}

      <Popups
        popup={popup}
        onClose={closePopup}
        toolbarPosition={toolbar.position}
        onSelectTable={(rows, cols) => handleInsertTable(rows, cols)}
        onInsertLink={({ url, text }) => handleInsertLink({ url, text })}
        onInsertImageByUrl={handleInsertImageByUrl}
        onInsertImageByFile={handleInsertImageByFile}
        onTextColor={handleTextColor}
        onHighlightColor={handleHighlightColor}
        handleEmojiClick={handleEmojiClick}
        openPopup={openPopup}
      />
    </div>
  );
}

NdeEditor.propTypes = ndeEditorPropTypes;
NdeEditor.defaultProps = ndeEditorDefaultProps;

{
  /* <NdeEditor
  value={editorHtml}
  onChange={setEditorHtml}
  placeholder="Type your email..."
  minHeight="300px"

  editorTheme={{
    borderColor: "#E5E7EB",
    borderRadius: 12,
    background: "#FFFFFF",

    mergeTagBg: "#EEF2FF",
    mergeTagColor: "#4F46E5",
    mergeTagRadius: 6,
  }}

  toolbar={{
    type: "full",
    position: "top",
    config: {},
    mergeTags: [],
    theme: {
      toolbarBg: "#F9FAFB",
      toolbarBorderColor: "#E5E7EB",

      buttonSize: 34,
      iconSize: 18,
      buttonRadius: 8,

      buttonBorderColor: "#E5E7EB",
      buttonHoverBg: "#F3F4F6",
      buttonHoverBorderColor: "#D1D5DB",
    },
  }}
/> */
}
