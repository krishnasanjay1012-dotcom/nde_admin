import { useEffect } from 'react';

export default function PlainTextEditor({
  textareaRef,
  onChange,
  placeholder,
  minHeight,
  content,
  setPlainText,
  value,
  isPlainText,
}) {
  useEffect(() => {
    if (isPlainText && textareaRef.current) {
      const textarea = textareaRef.current;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const text = tempDiv.innerText || tempDiv.textContent || '';

      setPlainText(text);

      requestAnimationFrame(() => {
        textarea.focus();
        const length = text.length;
        textarea.setSelectionRange(length, length);
      });
    }
  }, [isPlainText, content]);

  return (
    <textarea
      ref={textareaRef}
      key={isPlainText ? 'plain' : 'rich'}
      autoFocus
      placeholder={placeholder}
      // disabled={disabled}
      spellCheck={true}
      autoCorrect="on"
      autoComplete="on"
      autoCapitalize="sentences"
      style={{
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
        width: '100%',
        resize: 'vertical',
        padding: '12px',
        borderRadius: '8px',
        outline: 'none',
        border: 'none',
        fontSize: '16px',
      }}
      value={value}
      onChange={onChange}
    />
  );
}
