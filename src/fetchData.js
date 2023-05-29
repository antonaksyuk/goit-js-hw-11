const KEY = '36785491-9ea82aeb1b34a8a741b020ac6';
import axios from 'axios';
const URL = 'https://pixabay.com/api/';
import Notiflix from "notiflix";
import LoadButton from './loadMore';

const loadButton = new LoadButton({
    selector: '[data-action="load-more"]',
    hidden: true
})

export default class fetchImages {
    constructor() {
        this.query = '';
        this.page = 1;
        this.totalHits = '';
    }
    async getImages() {
        const res = await axios.get(`${URL}/?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
        const data = await res.data;
            
        if (data.hits.length === 0) {
            loadButton.hide();
            Notiflix.Notify.failure(
                "Sorry, there are no images matching your search query. Please try again."
            );
        }
        else {
            this.incrementPage();

            return data;
        }
    };

    get searchQuery() {
        return this.query;
    };
    set searchQuery(query) {
        this.query = query
    };

    incrementPage() {
    this.page += 1;
    };

    resetPage() {
    this.page = 1;
    };

    get hits() {
    return this.totalHits;
    }
    
  set hits(newTotalHits) {
    this.totalHits = newTotalHits;
    }

  showTotalHits(hits) {
    Notiflix.Notify.success(`Hooray! We found ${hits} images.`);
  }
};
