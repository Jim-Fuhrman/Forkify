import icons from 'url:../../img/icons.svg';  // Parcel 2

export default class View {
    _data;

    render(data, render = true) {
        //!data only works for undefined. To check for an empty array use the other half of the "or" clause.
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();
    
        if (!render) return markup;
    
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
      // if(!data || (Array.isArray(data) && data.length === 0)) 
      //   return this.renderError();

      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));
      // console.log(newElements);
      // console.log(curElements);

      newElements.forEach((newEl, i) => {
        const curEl = curElements[i];
        // console.log(curEl, newEl.isEqualNode(curEl));

        //Updates changed text
// the question mark in the next line is optional chaining. There might not always be a firstChild node Value. 
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
          // console.log('🧨', newEl.firstChild.nodeValue.trim())
          curEl.textContent = newEl.textContent
        }

        //Updates changed attributes
        if(!newEl.isEqualNode(curEl)) 
          Array.from(newEl.attributes).forEach(attr =>
            curEl.setAttribute(attr.name, attr.value));
    });
  }

    _clear() {
        // console.log(this._parentElement);
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
      const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
      `;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    
    renderError(message = this._errorMessage) {
      const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
      const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}