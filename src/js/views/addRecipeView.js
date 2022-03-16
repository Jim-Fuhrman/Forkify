import View from './View.js';
import icons from 'url:../../img/icons.svg';  // Parcel 2

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded :)'

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe')
    _btnClose = document.querySelector('.btn--close-modal')

    constructor() {
        // console.log(`_btnOpen: ${_btnOpen}`)
        super() // since this is a child class, we need "super". Only after invoking "super" can we use the "this" keyword.
        this._addHandlerShowWindow();  //this underscore means "protected".
        this._addHandlerHideWindow();  //this underscore means "protected".
    }
    
    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }
    
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
    
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }
    
    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr)
            handler(data);
        })
    }

    /* addHandlerShowWindow as coded below produced "undefined" when testing. That's because "this" points to the element being clicked.  To get the desired result we needed to recode addHandlerShowWindow as coded above. */
    
    // _addHandlerShowWindow() {
    //     this._btnOpen.addEventListener('click', function() {
    //         this._overlay.classList.toggle('hidden');
    //         this._window.classList.toggle('hidden');
    //     })
    // }

    _generateMarkup() {
        
    }
}


export default new AddRecipeView()