

class Utils {
    /**
     * Constructs a full URL by combining the current origin with the given path.
     * 
     * @param {string} path - The path to append to the current origin.
     * @returns {string} - The full URL consisting of the origin and the provided path.
     */
    static getUrl(path) {
        return window.location.origin + path;
    }

    static getFormId(form) {
        return form.getAttribute('id');
    }

    static getFormEndpoint(FormHandler, form) {
        return FormHandler[Utils.getFormId(form)];
    }

    static handleFormErrors(errorResponse, selector = 'input') {
        console.log(errorResponse);
        if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
            errorResponse.errors.forEach(({ handler, message }) => {
                const input = document.querySelector(`${selector}[name="${handler}"]`);
                if (input) {
                    input.classList.add("is-invalid");
                    const errorMessageElement = input.nextElementSibling;
                    if (errorMessageElement) {
                        errorMessageElement.innerHTML = message;
                    }
                }
            });
        }
    }

}

export default Utils;
