import { useRef, useEffect, useCallback, useState } from 'react';
import Squire from 'squire-rte';
import { sanitizeToDOMFragment } from '../utils/SanitizeHtml';
import { buildTableHTML } from '../utils/table';
import { fileToBase64 } from '../utils/getFileToBase64';
import { uploadAndInsertImage } from './useUploadAndInsertImage';

export function useEditorConfig({
  value = '',
  initialHTML = '',
  placeholder = 'Write something…',
  defaultFormat = {},
  onChange,
  disabled = false,
  imageInsertMode,
  uploadInlineImage,
  getImageUrl,
}) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const isInternalChangeRef = useRef(false);
  const isFocusedRef = useRef(false);

  const lastAppliedHTMLRef = useRef('');

  const [format, setFormat] = useState({});
  const [fontInfo, setFontInfo] = useState({});
  const [undoState, setUndoState] = useState({ canUndo: false, canRedo: false });
  const [content, setContent] = useState(initialHTML || '');
  const [isPlainText, setIsPlainText] = useState(false);
  const [plainText, setPlainText] = useState('');

  // ---- Format detector ----
  const updateFormatFromEditor = useCallback(editor => {
    const path = editor.getPath();
    const isSelection = path === '(selection)';
    const bold = isSelection ? editor.hasFormat('B') : /\b(B|STRONG)\b/i.test(path);
    const italic = isSelection ? editor.hasFormat('I') : /\b(I|EM)\b/i.test(path);
    const underline = isSelection ? editor.hasFormat('U') : /\bU\b/i.test(path);
    const strikethrough = isSelection ? editor.hasFormat('S') : /\b(S|STRIKE)\b/i.test(path);
    const link = isSelection ? editor.hasFormat('A') : /\bA\b/i.test(path);
    const code =
      /\b(CODE|PRE)\b/i.test(path) ||
      (isSelection && (editor.hasFormat('CODE') || editor.hasFormat('PRE')));
    const inList = /\b(UL|OL)\b/i.test(path);
    const inOrderedList = /\bOL\b/i.test(path);
    const inUnorderedList = /\bUL\b/i.test(path);
    const inBlockquote = /\bBLOCKQUOTE\b/i.test(path);

    setFormat({
      bold,
      italic,
      underline,
      strikethrough,
      link,
      code,
      inList,
      inOrderedList,
      inUnorderedList,
      inBlockquote,
    });

    const info = editor.getFontInfo?.() || {};
    const normalizeFontFamily = family => family?.split(',')[0].replace(/["']/g, '').trim() || '';
    setFontInfo({
      fontFamily: normalizeFontFamily(info.fontFamily),
      fontSize: info.fontSize || '',
      color: info.color || '',
      backgroundColor: info.backgroundColor || '',
      align: info.align || 'left',
    });
  }, []);

  // ---- Trigger onChange ----
  const triggerChange = useCallback(
    editor => {
      if (!editor || isInternalChangeRef.current) return;
      const html = editor.getHTML();
      lastAppliedHTMLRef.current = html;
      const text = editor.getText?.() || editor.getRoot()?.innerText || '';
      const info = editor.getFontInfo?.() || {};

      const temp = document.createElement('div');
      temp.innerHTML = html;
      const plainText = temp.textContent || temp.innerText || '';

      const mergedFontInfo = {
        fontFamily: info.fontFamily || '',
        fontSize: info.fontSize || '',
        color: info.color || '',
        align: info.align || 'left',
        backgroundColor: info.backgroundColor || '',
      };
      setContent(html);

      if (isPlainText) {
        onChange?.(plainText);
      } else {
        onChange?.(html);
      }
      // onChange?.({ html, text, fontInfo: mergedFontInfo });
    },
    [onChange, isPlainText]
  );

  // ---- Initialize editor ----
  useEffect(() => {
    if (isPlainText) return;

    const el = containerRef.current;
    if (!el) return;

    const editorRoot = document.createElement('div');
    editorRoot.className = 'squire-editor-root';

    editorRoot.setAttribute('data-placeholder', placeholder);
    editorRoot.setAttribute('contenteditable', 'true');
    editorRoot.setAttribute('spellcheck', 'true');
    editorRoot.setAttribute('autocorrect', 'on');
    editorRoot.setAttribute('autocomplete', 'on');
    editorRoot.setAttribute('autocapitalize', 'sentences');
    el.appendChild(editorRoot);

    const editor = new Squire(editorRoot, {
      blockTag: 'P',
      tagAttributes: {
        a: { target: '_blank' },
        span: {
          class: function (node) {
            // Allow merge-tag class for spans
            return node.className.includes('merge-tag') ? node.className : null;
          },
        },
      },
      blockAttributes: {
        style: `
          font-family: ${defaultFormat.fontFamily || 'Arial'};
          font-size: ${defaultFormat.fontSize || '16px'};
          color: ${defaultFormat.color || '#000'};
          text-align: ${defaultFormat.align || 'left'};
        `,
      },
      sanitizeToDOMFragment,
    });
    editorRef.current = editor;

    if (initialHTML) {
      isInternalChangeRef.current = true;

      // Build style string from defaultFormat
      const style = `
        font-family: ${defaultFormat.fontFamily || 'Arial'};
        font-size: ${defaultFormat.fontSize || '16px'};
        color: ${defaultFormat.color || '#000'};
        text-align: ${defaultFormat.align || 'left'};
      `;

      const htmlWithStyle = `<p style="${style}">${initialHTML}</p>`;

      editor.setHTML(htmlWithStyle);
      isInternalChangeRef.current = false;
    }

    //Apply default formatting to all editor content
    const range = document.createRange();
    range.selectNodeContents(editor.getRoot());
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    if (defaultFormat.fontFamily) editor.setFontFace(defaultFormat.fontFamily);
    if (defaultFormat.fontSize) editor.setFontSize(defaultFormat.fontSize);
    if (defaultFormat.color) editor.setTextColor(defaultFormat.color);
    if (defaultFormat.align) editor.setTextAlignment(defaultFormat.align);

    // collapse cursor to the end
    sel.collapse(editor.getRoot(), editor.getRoot().childNodes.length);

    editor.focus();

    // Setup event handlers
    const onInput = () => triggerChange(editor);
    const onPathChange = () => updateFormatFromEditor(editor);
    const onUndoStateChange = e => {
      const d = e.detail;
      if (d && typeof d.canUndo === 'boolean' && typeof d.canRedo === 'boolean') {
        setUndoState({ canUndo: d.canUndo, canRedo: d.canRedo });
      }
    };

    editor.addEventListener('input', onInput);
    editor.addEventListener('pathChange', onPathChange);
    editor.addEventListener('undoStateChange', onUndoStateChange);
    const onFocus = () => (isFocusedRef.current = true);
    const onBlur = () => (isFocusedRef.current = false);

    editorRoot.addEventListener('focus', onFocus, true);
    editorRoot.addEventListener('blur', onBlur, true);

    updateFormatFromEditor(editor);

    return () => {
      editor.removeEventListener('input', onInput);
      editor.removeEventListener('pathChange', onPathChange);
      editor.removeEventListener('undoStateChange', onUndoStateChange);
      editorRoot.removeEventListener('focus', onFocus, true);
      editorRoot.removeEventListener('blur', onBlur, true);

      editor.destroy();
      editorRef.current = null;
      if (el.contains(editorRoot)) el.removeChild(editorRoot);
    };
  }, [isPlainText]);

  useEffect(() => {
    if (isPlainText) return;

    const editor = editorRef.current;
    if (!editor) return;

    if (isFocusedRef.current) return;

    const next = value || '';

    if (lastAppliedHTMLRef.current === next) return;

    isInternalChangeRef.current = true;
    editor.setHTML(next);
    isInternalChangeRef.current = false;

    lastAppliedHTMLRef.current = next;
  }, [value, isPlainText]);

  // ---- Helpers ----
  const run = useCallback(
    fn => {
      const editor = editorRef.current;
      if (!editor || disabled) return;
      editor.focus();
      fn(editor);
      triggerChange(editor);
      updateFormatFromEditor(editor);
    },
    [disabled, triggerChange, updateFormatFromEditor]
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (isPlainText) {
      const html = editor.getHTML();
      const temp = document.createElement('div');
      temp.innerHTML = html;
      setPlainText(temp.textContent || temp.innerText || '');
    }
  }, [isPlainText]);

  // const handleInsertLink = useCallback(() => {
  //   const editor = editorRef.current;
  //   if (!editor || disabled) return;
  //   editor.focus();
  //   const url = prompt("Enter URL:");
  //   if (url?.trim()) editor.makeLink(url.trim(), { target: "_blank" });
  // }, [disabled]);

  const handleInsertLink = useCallback(
    ({ url, text }) => {
      const editor = editorRef.current;
      if (!editor || disabled) return;

      editor.focus();

      const safeUrl = url.trim();
      if (!safeUrl) return;

      const safeText = text?.trim() || safeUrl;

      editor.insertHTML(`
      <a 
        href="${safeUrl}" 
        target="_blank" 
        rel="noopener noreferrer"
        style="color:#1a73e8; text-decoration:underline;"
      >
        ${safeText}
      </a>
    `);
    },
    [disabled]
  );

  // const handleRemoveLink = useCallback(() => {
  //   const editor = editorRef.current;
  //   if (!editor || disabled) return;

  //   editor.focus();
  //   editor.removeLink();
  // }, [disabled]);

  // const handleInsertImage = useCallback(() => {
  //   const editor = editorRef.current;
  //   if (!editor || disabled) return;
  //   editor.focus();
  //   const url = prompt("Enter image URL:");
  //   if (url?.trim()) editor.insertImage(url.trim(), {});
  // }, [disabled]);

  const handleInsertImageByUrl = useCallback(
    url => {
      const editor = editorRef.current;
      if (!editor || disabled) return;

      editor.focus();

      const safeUrl = url?.trim();
      if (!safeUrl) return;

      editor.insertImage(safeUrl, {});
    },
    [disabled]
  );

  const handleInsertImageByFile = useCallback(
    async file => {
      const editor = editorRef.current;
      if (!editor || disabled || !file) return;

      editor.focus();

      if (!file.type?.startsWith('image/')) return;

      const mode = imageInsertMode;

      if (mode === 'base64') {
        const base64 = await fileToBase64(file);
        editor.insertImage(base64, { alt: file.name || 'image' });
        return;
      }

      if (mode === 'upload') {
        await uploadAndInsertImage({
          editor,
          file,
          disabled,
          uploadFn: uploadInlineImage,
          getUrl: getImageUrl,
        });
        return;
      }

      if (mode === 'base64_then_upload') {
        const editor = editorRef.current;
        if (!editor || disabled || !file) return;

        editor.focus();

        const base64 = await fileToBase64(file);
        editor.insertImage(base64, { alt: file.name || 'image' });

        const root = editor.getRoot();
        const imgs = root.querySelectorAll('img');
        const insertedImg = imgs[imgs.length - 1];

        const res = await uploadInlineImage(file);
        const url = getImageUrl(res);

        if (insertedImg && url) {
          insertedImg.src = url;
        }
      }
    },
    [disabled, imageInsertMode, uploadInlineImage, getImageUrl]
  );

  const handleTextColor = color => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    editor.setTextColor(color);
  };

  const handleHighlightColor = color => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    editor.setHighlightColor(color);
  };

  const handleInsertTable = useCallback(
    (rows, cols) => {
      const editor = editorRef.current;
      if (!editor || disabled) return;

      editor.focus();
      editor.insertHTML(buildTableHTML(rows, cols));
    },
    [disabled]
  );
  const handleEmojiClick = useCallback(
    emojiData => {
      run(e => {
        e.focus();
        e.insertHTML(emojiData.emoji);
      });
    },
    [run]
  );

  const handleInsertMergeTag = useCallback(
    tag => {
      run(editor => {
        // Create merge tag HTML with proper spacing
        const mergeTagHTML = `&#8203;<span class="squire-merge-tag" contenteditable="false" data-merge-tag="${tag}">${tag}</span>&nbsp;`;

        // Insert the merge tag
        editor.insertHTML(mergeTagHTML);

        // Move cursor to the very end of the editor
        const root = editor.getRoot();
        const range = document.createRange();
        range.selectNodeContents(root);
        range.collapse(false); // Collapse to end

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        editor.focus();
      });
    },
    [run]
  );

  return {
    editorRef,
    containerRef,
    format,
    fontInfo,
    undoState,
    content,
    setContent,
    run,
    handleTextColor,
    handleHighlightColor,
    handleInsertLink,
    // handleRemoveLink,
    handleInsertImageByUrl,
    handleInsertImageByFile,
    handleInsertTable,
    handleEmojiClick,
    handleInsertMergeTag,
    plainText,
    isPlainText,
    setIsPlainText,
    setPlainText,
  };
}
