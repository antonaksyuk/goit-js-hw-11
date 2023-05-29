import fetchImages from "./fetchData";
import LoadButton from "./loadMore";
import Notiflix from "notiflix";
import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
    inputForm: document.querySelector(".search-form"),
    input: document.querySelector('[name="searchQuery"]'),
    gallery: document.querySelector(".gallery"),
    loadButton: document.querySelector(".load-more"),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});

const loadButton = new LoadButton({
    selector: '[data-action="load-more"]',
    hidden: true
})

const FetchImages = new fetchImages();
refs.inputForm.addEventListener('submit', onSearch);
loadButton.refs.button.addEventListener("click", loadMore);

async function onSearch(evt) {
    evt.preventDefault();
    try {
       FetchImages.searchQuery = evt.target.elements.searchQuery.value.trim();
        loadButton.show();
        FetchImages.resetPage();
        clearForm();
        if (FetchImages.searchQuery !== '') {
          await FetchImages.getImages(FetchImages.searchQuery).then((data) => {
            if (!data || data.totalHits === 0) {
              refs.inputForm.reset();
              return;
            } else {
              createMarkup(data)
              FetchImages.showTotalHits(data.totalHits);
              refs.inputForm.reset();
            }
          }); 
            
        }}
    catch (error) {
        console.log(error);
    }}

async function createMarkup(markup) {
    try {
      const makeMarkup = await markup.hits.map(item => {
        return `<div class="photo-card">
  <a href="${item.largeImageURL}" class="large-photocard">
  <div class="thumb">
  <img src="${item.webformatURL}" alt="${item.tags}" class="photo-image" loading="lazy" />
  </div>
  <div class="info">
    <p class="info-item">
      <b>Likes</br>${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views</br>${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments</br>${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</br>${item.downloads}</b>
    </p>
  </div>
  </a>
</div>`
      });
        refs.gallery.insertAdjacentHTML("beforeend", makeMarkup)
        lightbox.refresh();
       }
    catch (error) {
        console.log(error);
    }
};

async function loadMore() {
  try {
     loadButton.enable();
    await FetchImages.getImages();
    await FetchImages
      .getImages(FetchImages.searchName, FetchImages.totalHits)
      .then((data) => {
        createMarkup(data);
        if ((FetchImages.page - 1) * 40 >= data.totalHits) {
          loadButton.hide();
          Notiflix.Notify.success(
            "We're sorry, but you've reached the end of search results."
          );
        }
      });
        
} catch (error) {
    console.log(error);
  }
}

function clearForm() {
  refs.gallery.innerHTML = "";
}