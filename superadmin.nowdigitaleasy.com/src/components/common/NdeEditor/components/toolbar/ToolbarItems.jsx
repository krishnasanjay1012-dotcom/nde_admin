import React from 'react';
import { RendererImage } from '../RenderButtonImg';
import Styles from '../../styles/Toolbar.module.css';

export const TOOLBAR_ITEMS = {
  bold: {
    title: 'Bold',
    render: () => <RendererImage buttonName="bold" />,
    isActive: f => f.bold,
    onClick: ({ run, format }) => run(e => (format.bold ? e.removeBold() : e.bold())),
  },

  italic: {
    title: 'Italic',
    render: () => <RendererImage buttonName="italic" />,
    isActive: f => f.italic,
    onClick: ({ run, format }) => run(e => (format.italic ? e.removeItalic() : e.italic())),
  },

  underline: {
    title: 'Underline',
    render: () => <RendererImage buttonName="underline" />,
    isActive: f => f.underline,
    onClick: ({ run, format }) =>
      run(e => (format.underline ? e.removeUnderline() : e.underline())),
  },

  strike: {
    title: 'Strikethrough',
    render: () => <RendererImage buttonName="strike" />,
    isActive: f => f.strikethrough,
    onClick: ({ run, format }) =>
      run(e => (format.strikethrough ? e.removeStrikethrough() : e.strikethrough())),
  },

  subscript: {
    title: 'Subscript',
    render: () => <RendererImage buttonName="sub" />,
    isActive: format => format.subscript,
    onClick: ({ run, format }) =>
      run(e => (format.subscript ? e.removeSubscript() : e.subscript())),
  },

  superscript: {
    title: 'Superscript',
    render: () => <RendererImage buttonName="super" />,
    isActive: format => format.superscript,
    onClick: ({ run, format }) =>
      run(e => (format.superscript ? e.removeSuperscript() : e.superscript())),
  },

  emoji: {
    title: 'Emoji',
    render: () => <RendererImage buttonName="emoji" />,
    // onClick: ({ setShowEmoji }) => setShowEmoji((p) => !p),
    onClick: ({ openPopup, event }) => openPopup('emoji', event),
  },

  fontFamily: {
    type: 'select',
    title: 'Font Family',
    placeholder: 'Font',
    getValue: ({ fontInfo }) => fontInfo.fontFamily || '',
    options: ({ FONT_FAMILIES }) => FONT_FAMILIES.map(f => ({ label: f, value: f })),
    onChange: ({ run, value }) =>
      run(e => {
        if (!value) return;
        e.setFontFace(value);
      }),
  },

  fontSize: {
    type: 'select',
    title: 'Font Size',
    placeholder: 'Size',
    getValue: ({ fontInfo }) => fontInfo.fontSize || '',
    options: ({ FONT_SIZES }) => FONT_SIZES.map(s => ({ label: s, value: s })),
    onChange: ({ run, value }) =>
      run(e => {
        if (!value) return;
        e.setFontSize(value);
      }),
  },

  // textColor: {
  //   type: "color",
  //   title: "Text Color",
  //   render: () => <RendererImage buttonName="color" />,
  //   getValue: ({ fontInfo }) => fontInfo.color || "#000000",
  //   onChange: ({ run, value }) =>
  //     run((e) => {
  //       e.setTextColor(value);
  //     }),
  // },

  // bgColor: {
  //   type: "color",
  //   title: "Highlight Color",
  //   render: () => <RendererImage buttonName="bkcolor" />,
  //   getValue: ({ fontInfo }) => fontInfo.backgroundColor || "#ffffff",
  //   onChange: ({ run, value }) =>
  //     run((e) => {
  //       e.setHighlightColor(value);
  //     }),
  // },

  textColor: {
    type: 'color',
    title: 'Text Color',
    render: () => <RendererImage buttonName="color" />,
    getValue: ({ fontInfo }) => fontInfo.color || '#000000',
    onClick: ({ openPopup, event }) => openPopup('colorText', event),
  },

  bgColor: {
    type: 'color',
    title: 'Highlight Color',
    render: () => <RendererImage buttonName="bkcolor" />,
    getValue: ({ fontInfo }) => fontInfo.backgroundColor || '#ffffff',
    onClick: ({ openPopup, event }) => openPopup('colorHighlight', event),
  },

  ul: {
    title: 'Bulleted List',
    render: () => <RendererImage buttonName="bullet" />,
    isActive: f => f.inUnorderedList,
    onClick: ({ run }) => run(e => e.makeUnorderedList()),
  },

  ol: {
    title: 'Numbered List',
    render: () => <RendererImage buttonName="number" />,
    isActive: f => f.inOrderedList,
    onClick: ({ run }) => run(e => e.makeOrderedList()),
  },

  indent: {
    title: 'Indent',
    render: () => <RendererImage buttonName="indent" />,
    onClick: ({ run }) =>
      run(e => {
        e.focus();
        document.execCommand('indent');
      }),
  },

  outdent: {
    title: 'Outdent',
    render: () => <RendererImage buttonName="outdent" />,
    onClick: ({ run }) =>
      run(e => {
        e.focus();
        document.execCommand('outdent');
      }),
  },

  removeList: {
    title: 'Remove List',
    render: () => <span style={{ fontSize: 12 }}>No list</span>,
    disabled: ({ format }) => !format.inList,
    onClick: ({ run }) => run(e => e.removeList()),
  },

  alignLeft: {
    title: 'Align Left',
    render: () => <RendererImage buttonName="left" />,
    onClick: ({ run }) => run(e => e.setTextAlignment('left')),
  },

  alignCenter: {
    title: 'Align Center',
    render: () => <RendererImage buttonName="center" />,
    onClick: ({ run }) => run(e => e.setTextAlignment('center')),
  },

  alignRight: {
    title: 'Align Right',
    render: () => <RendererImage buttonName="right" />,
    onClick: ({ run }) => run(e => e.setTextAlignment('right')),
  },

  //   justify: {
  //   title: "Justify",
  //   render: () => <span style={{ fontSize: 12 }}>J</span>,
  //   onClick: ({ run }) =>
  //     run((e) => {
  //       e.focus();
  //       document.execCommand("justifyFull");
  //     }),
  // },

  link: {
    title: 'Insert Link',
    render: () => <RendererImage buttonName="link" />,
    isActive: f => f.link,
    // onClick: ({ handleLink }) => handleLink(),
    onClick: ({ openPopup, event }) => openPopup('link', event),
  },

  unlink: {
    title: 'Remove Link',
    render: () => <RendererImage buttonName="unlink" />,
    disabled: ({ format }) => !format.link,
    onClick: ({ run }) => run(e => e.removeLink()),
  },

  blockquote: {
    title: 'Blockquote',
    render: () => <RendererImage buttonName="blockquote" />,
    onClick: ({ run }) => run(e => e.increaseQuoteLevel()),
  },

  unblockquote: {
    title: 'Remove quote',
    render: () => <RendererImage buttonName="unblockquote" />,
    onClick: ({ run }) => run(e => e.decreaseQuoteLevel()),
  },

  code: {
    title: 'Code',
    render: () => <RendererImage buttonName="code" />,
    isActive: f => f.code,
    onClick: ({ run }) => run(e => e.toggleCode()),
  },

  hr: {
    title: 'Horizontal Line',
    render: () => <span>―</span>,
    onClick: ({ run }) =>
      run(e => {
        e.insertHTML('<hr><p></p>');
      }),
  },

  clear: {
    title: 'Clear Formatting',
    render: () => <RendererImage buttonName="unformat" />,
    onClick: ({ run }) => run(e => e.removeAllFormatting()),
  },

  undo: {
    title: 'Undo',
    render: () => <RendererImage buttonName="undo" />,
    disabled: ({ undoState }) => !undoState.canUndo,
    onClick: ({ run }) => run(e => e.undo()),
  },

  redo: {
    title: 'Redo',
    render: () => <RendererImage buttonName="redo" />,
    disabled: ({ undoState }) => !undoState.canRedo,
    onClick: ({ run }) => run(e => e.redo()),
  },

  image: {
    title: 'Insert Image',
    render: () => <RendererImage buttonName="image" />,
    // onClick: ({ handleInsertImage }) => handleInsertImage(),
    onClick: ({ openPopup, event }) => openPopup('image', event),
  },

  table: {
    title: 'Insert Table',
    render: () => <RendererImage buttonName="table" />,
    // onClick: ({ handleInsertTable }) => handleInsertTable(),
    onClick: ({ openPopup, event }) => openPopup('table', event),
  },

  plainTextToggle: {
    title: 'Plain / Rich',
    render: () => <span style={{ fontSize: 12 }}>TXT</span>,
    onClick: ({ setIsPlainText }) => setIsPlainText(p => !p),
  },

  mergeTags: {
    type: 'custom',
    title: 'Insert Merge Tag',
    renderCustom: ({ mergeTags, handleInsertMergeTag, disabled }) => {
      if (!mergeTags?.length) return null;

      return (
        <select
          className={Styles['squire-btn']}
          disabled={disabled}
          defaultValue=""
          onChange={e => {
            const tag = e.target.value;
            if (!tag) return;
            handleInsertMergeTag(tag);
            e.target.selectedIndex = 0;
          }}
        >
          <option value="">Insert Merge Tag</option>
          {mergeTags.map(tag => (
            <option key={tag.value} value={tag.value}>
              {tag.label}
            </option>
          ))}
        </select>
      );
    },
  },
};
