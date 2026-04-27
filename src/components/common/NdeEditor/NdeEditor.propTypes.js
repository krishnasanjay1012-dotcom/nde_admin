import PropTypes from 'prop-types';

export const ndeEditorPropTypes = {
  value: PropTypes.string,
  initialHTML: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,

  defaultFormat: PropTypes.shape({
    fontFamily: PropTypes.string,
    fontSize: PropTypes.string,
    color: PropTypes.string,
    align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
    spellCheck: PropTypes.bool,
  }),

  toolbar: PropTypes.shape({
    type: PropTypes.oneOf(['full', 'standard', 'basic']),
    position: PropTypes.oneOf(['top', 'bottom']),
    config: PropTypes.oneOf([
      'bold',
      'italic',
      'underline',
      'strike',

      'emoji',

      'subscript',
      'superscript',

      'fontFamily',
      'fontSize',
      'textColor',
      'bgColor',

      'link',
      'unlink',

      'blockquote',
      'unblockquote',
      'code',

      'ul',
      'ol',
      'indent',
      'outdent',

      'alignLeft',
      'alignCenter',
      'alignRight',

      'hr',
      'image',
      'table',

      'clear',
      'undo',
      'redo',

      'plainTextToggle',
      'mergeTags',
    ]),

    mergeTags: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),

    theme: PropTypes.shape({
      toolbarBg: PropTypes.string,
      toolbarBorderColor: PropTypes.string,
      iconSize: PropTypes.number,
      buttonSize: PropTypes.number,
      buttonRadius: PropTypes.number,
      buttonBorderColor: PropTypes.string,
      buttonHoverBg: PropTypes.string,
      buttonHoverBorderColor: PropTypes.string,
    }),
  }),

  editorTheme: PropTypes.shape({
    borderColor: PropTypes.string,
    borderRadius: PropTypes.number,
    background: PropTypes.string,

    mergeTagBg: PropTypes.string,
    mergeTagColor: PropTypes.string,
    mergeTagRadius: PropTypes.number,
  }),

  imageInsertMode: PropTypes.oneOf(['upload', 'base64', 'base64_then_upload']),
  uploadInlineImage: PropTypes.func,
  getImageUrl: PropTypes.func,
};

export const ndeEditorDefaultProps = {
  value: '',
  initialHTML: '',
  placeholder: 'Write something…',
  minHeight: '200px',
  disabled: false,
  defaultFormat: {},
  toolbar: {
    type: 'full',
    position: 'top',
    config: [],
    mergeTags: {},
    theme: {},
  },
  editorTheme: {},
  imageInsertMode: 'base64',
};
