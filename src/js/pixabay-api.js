import axios from 'axios';
export async function getImagesFromPixabay(query, perPage, page) {
  const KEY = '42468615-7a21ca39eb8f796f5c09d98b3';
  const BASE_URL = 'https://pixabay.com/api/';
  const IMAGE_TYPE = 'photo';
  const ORIENTATION = 'horizontal';
  const SAFESEARCH = true;

  const LINK = `${BASE_URL}?key=${KEY}&q=${query}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFESEARCH}&per_page=${perPage}&page=${page}`;

  const response = await axios.get(LINK);

  return response.data;
}
