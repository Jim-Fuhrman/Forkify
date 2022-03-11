import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';  // Parcel 2

class resultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for that query. Please try again.';
    _message = '';

    _generateMarkup() {
      // we need to return a string from _generateMarkup. That's what the next line does.
      return this._data
          .map(result => previewView.render(result, false))
          .join('')
    }
  }   


export default new resultsView();