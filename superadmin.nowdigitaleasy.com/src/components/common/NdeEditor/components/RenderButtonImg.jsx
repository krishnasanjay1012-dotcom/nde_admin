import React from 'react';
import styles from '../styles/Toolbar.module.css';
import BOLD_SVG from '../Assets/bold.svg';
import ITALIC_SVG from '../Assets/italic.svg';
import UNDERLINE_SVG from '../Assets/underline.svg';
import BULLETS_SVG from '../Assets/bullets.svg';
import NUMBERING_SVG from '../Assets/numbering.svg';
import OUTDENT_SVG from '../Assets/outdent.svg';
import INDENT_SVG from '../Assets/indent.svg';
import BLOCKQUOTE_SVG from '../Assets/blockquote.svg';
import UNBLOCKQUOTE_SVG from '../Assets/unblockquote.svg';
import ALIGNLEFT_SVG from '../Assets/alignleft.svg';
import ALIGNCENTER_SVG from '../Assets/aligncenter.svg';
import ALIGNRIGHT_SVG from '../Assets/alignright.svg';
import UNLINK_SVG from '../Assets/unlink.svg';
import SUPERSCRIPT_SVG from '../Assets/superscript.svg';
import SUBSCRIPT_SVG from '../Assets/subscript.svg';
import STRIKETHROUGH_SVG from '../Assets/strikethrough.svg';
import UNDO_SVG from '../Assets/undo.svg';
import REDO_SVG from '../Assets/redo.svg';
import REMOVEFORMAT_SVG from '../Assets/removeformat.svg';
import DROPDOWN_SVG from '../Assets/dropdown.svg';
import BACKCOLOR_SVG from '../Assets/backcolor.svg';
import TEXTCOLOR_SVG from '../Assets/textcolor.svg';
import CREATELINK_SVG from '../Assets/createlink.svg';
import IMAGE_ALT_TEXT_SVG from '../Assets/imagealttext.svg';
import FONTSIZE_SVG from '../Assets/fontsize.svg';
import FONTNAME_SVG from '../Assets/fontname.svg';
import EMOJI_SVG from '../Assets/emoji.svg';
import CODE_SVG from '../Assets/code.svg';
import TABLE_SVG from '../Assets/table.svg';

const buttonImages = {
  image: IMAGE_ALT_TEXT_SVG,
  emoji: EMOJI_SVG,
  bold: BOLD_SVG,
  italic: ITALIC_SVG,
  underline: UNDERLINE_SVG,
  font: FONTNAME_SVG,
  size: FONTSIZE_SVG,
  bkcolor: BACKCOLOR_SVG,
  color: TEXTCOLOR_SVG,
  bullet: BULLETS_SVG,
  number: NUMBERING_SVG,
  indent: INDENT_SVG,
  outdent: OUTDENT_SVG,
  blockquote: BLOCKQUOTE_SVG,
  unblockquote: UNBLOCKQUOTE_SVG,
  code: CODE_SVG,
  left: ALIGNLEFT_SVG,
  center: ALIGNCENTER_SVG,
  right: ALIGNRIGHT_SVG,
  link: CREATELINK_SVG,
  unlink: UNLINK_SVG,
  sub: SUBSCRIPT_SVG,
  super: SUPERSCRIPT_SVG,
  strike: STRIKETHROUGH_SVG,
  alttext: IMAGE_ALT_TEXT_SVG,
  undo: UNDO_SVG,
  redo: REDO_SVG,
  unformat: REMOVEFORMAT_SVG,
  table: TABLE_SVG,
  more: DROPDOWN_SVG,
};

export const RendererImage = ({ buttonName }) => {
  const image = buttonImages[buttonName] || DROPDOWN_SVG;

  return (
    <img src={image} alt={buttonName} draggable={false} className={styles['squire-btn-icon']} />
  );
};
