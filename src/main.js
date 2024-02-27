import { createMarkup } from './js/render-functions';
import { getImagesFromPixabay } from './js/pixabay-api';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector('.btn-section');
const input = document.querySelector('#data-search');
const button = document.querySelector('[data-start]');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.loadMoreBtn');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

axios.defaults.baseURL = 'https://pixabay.com/api/';

let currentPage = 1;
let perPage = 15;
let allPages = 1;
let inputValue = '';

loadMoreBtn.classList.remove('loadMoreBtn-visible');

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleFormSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  inputValue = await input.value.trim();

  if (!inputValue) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term.',
    });
    gallery.innerHTML = '';
    return;
  }

  loader.classList.add('loader-visible');
  loadMoreBtn.classList.add('loadMoreBtn-visible');

  try {
    const dataImages = await getImagesFromPixabay(inputValue, currentPage);
    if (dataImages.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      createMarkup(dataImages.hits);
      currentPage += 1;
      allPages = Math.ceil(dataImages.totalHits / perPage);

      lightbox.refresh();
      loadMoreBtn.classList.remove('loadMoreBtn-visible');
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching images.',
    });
  } finally {
    loader.classList.remove('loader-visible');
  }
}

async function handleLoadMore() {
  loader.classList.remove('loader-visible');
  try {
    const dataImages = await getImagesFromPixabay(inputValue, page);

    if (dataImages.hits.length > 0) {

        const startIndex = (currentPage - 1) * perPage;
        const endIndex = startIndex + perPage;
  
        createMarkup(dataImages.hits.slice(startIndex, endIndex));
        lightbox.refresh();
  
        currentPage += 1;
        if (startIndex + perPage < dataImages.totalHits) {
            loadMoreBtn.classList.add('loadMoreBtn-visible');
          } else {
            loadMoreBtn.classList.remove('loadMoreBtn-visible');
          }
    } else {
      loader.classList.remove('loader-visible');
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
  } finally {
    loader.classList.remove('loader-visible');
  }
}
