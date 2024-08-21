import icons from 'url:../../img/icons.svg';

export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered ( e.g. recipe )
     * @param {boolean} (render = true) If false, create markup String instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render = false
     * @this {Object} View instance
     * @author Ahmed Ibrahim
     * */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markUp = this._generateMarkup();

        if(!render) return markUp;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }
    renderSpinner() {
        const markup = `
            <div class="spinner">
                  <svg>
                    <use href="${icons}.svg#icon-loader"></use>
                  </svg>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

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
        `;
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
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        const newMarkUp = this._generateMarkup();
        // convert string to dom object
        const newDom = document.createRange().createContextualFragment(newMarkUp);

        const newElements = Array.from(newDom.querySelectorAll('*'));
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEL, i) => {
            const currentElement = currentElements[i];
            // Update changed text only
            if (!newEL.isEqualNode(currentElement) && newEL.firstChild?.nodeValue.trim() !== '') {
                currentElement.textContent = newEL.textContent;
            }
            // Update changed attributes
            if (!newEL.isEqualNode(currentElement)) {
                Array.from(newEL.attributes).forEach(attr => {
                    currentElement.setAttribute(attr.name, attr.value);
                });
            }

        });

    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

};