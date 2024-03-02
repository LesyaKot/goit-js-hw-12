export function createMarkup(images) {
  const gallery = document.querySelector('.gallery');

return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery-item">
            <a href="${largeImageURL}" class="gallery-link" data-lightbox="gallery">
              <img class="gallery-image"
               src="${webformatURL}"
               alt="${tags}"/>
               <div class="gallery-text">
              <p><span class="parameter-name">Likes:</span> <span class="likes-value">${likes}</span></p>
              <p><span class="parameter-name">Views:</span> <span class="likes-value">${views}</span></p>
              <p><span class="parameter-name">Comments:</span> <span class="likes-value">${comments}</span></p>
              <p><span class="parameter-name">Downloads:</span> <span class="likes-value">${downloads}</span></p>
              </div>
            </a>
          </li>`
    )
    .join('');
}