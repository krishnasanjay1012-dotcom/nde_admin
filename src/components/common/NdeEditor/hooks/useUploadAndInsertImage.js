import { fileToBase64 } from '../utils/getFileToBase64';

export async function uploadAndInsertImage({ editor, file, uploadFn, getUrl, disabled }) {
  if (!editor || disabled || !file) return;

  if (!file.type?.startsWith('image/')) return;

  editor.focus();

  const preview = await fileToBase64(file);
  editor.insertImage(preview, { alt: file.name });

  const response = await uploadFn(file);
  if (!response) throw new Error('Upload failed: empty response');

  const url = getUrl(response, file);
  if (!url) throw new Error('Upload success but no url found');

  editor.insertImage(url, {
    alt: file.name || 'image',
  });

  return { response, url };
}
