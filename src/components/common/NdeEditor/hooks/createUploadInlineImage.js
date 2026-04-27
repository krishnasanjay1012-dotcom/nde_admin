import axios from 'axios';

export const createUploadInlineImage = ({ baseURL, endpoint }) => {
  return async file => {
    const url = `${baseURL}${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(url, formData).then(({ data }) => data);
  };
};
