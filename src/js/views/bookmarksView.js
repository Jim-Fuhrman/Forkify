import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';  // Parcel 2

class bookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
    _message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        // we need to return a string from _generateMarkup. That's what the next line does.
        return this._data
            .map(bookmark => previewView.render(bookmark, false))
            .join('')
    }   
}

export default new bookmarksView();