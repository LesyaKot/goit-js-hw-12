import { createMarkup } from './js/render-functions';
import { getImagesFromPixabay } from './js/pixabay-api';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const form = document.querySelector('.btn-section');
const input = document.querySelector('#data-search');
const button = document.querySelector('[data-start]');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
const perPage = 15;
let inputValue = '';

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

  currentPage = 1;

  loader.classList.remove('is-hidden');

  try {
    const dataImages = await getImagesFromPixabay(
      inputValue,
      perPage,
      currentPage
    );
    if (dataImages.hits.length === 0) {
      loadMoreBtn.classList.add('is-hidden');
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      gallery.innerHTML = createMarkup(dataImages.hits);
      lightbox.refresh();
      loadMoreBtn.classList.remove('is-hidden');
      if (dataImages.hits.length < 15) {
        loadMoreBtn.classList.add('is-hidden');
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching images.',
    });
  } finally {
    loader.classList.add('is-hidden');
  }
}

function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');
  const galleryItemHeight = galleryItem.getBoundingClientRect().height;

  window.scrollBy({
    top: galleryItemHeight * 2,
    behavior: 'smooth',
  });
}

async function handleLoadMore() {
 
  loader.classList.add('is-hidden');

  currentPage += 1;

  try {
    const dataImages = await getImagesFromPixabay(
      inputValue,
      perPage,
      currentPage
    );
    const lastPage = Math.ceil(dataImages.totalHits / perPage);

    gallery.insertAdjacentHTML('beforeend', createMarkup(dataImages.hits));

    smoothScroll();

    lightbox.refresh();

    if (lastPage === currentPage) {
      loadMoreBtn.classList.add('is-hidden');
      iziToast.info({
        title: 'Info',
        message:
          'We are sorry, but you have reached the end of search results.',
      });
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
  } finally {
    loader.classList.add('is-hidden');
  }
}
