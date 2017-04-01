export default class ProgressText {
    /**
     *
     * @param {Element} progressTextWrapElem
     */
    constructor(progressTextWrapElem) {
        /**
         * @type {HTMLDivElement}
         * @private
         */
        this._wrapperElem = progressTextWrapElem;

        /**
         * @type {HTMLSpanElement}
         * @private
         */
        this._textElem = progressTextWrapElem.querySelector('.progress-text');
    }

    /**
     * @param {string} text
     */
    setText(text) {
        this._wrapperElem.style.display = 'block';
        this._textElem.innerText = text;
    }

    hide() {
        this._wrapperElem.style.display = 'none';
        this._textElem.innerText = '';
    }
}