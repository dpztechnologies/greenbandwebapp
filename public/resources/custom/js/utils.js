

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

    static handleFormErrors(errorResponse, selectors = ['input', 'select']) {
        const errorFields = new Set();

        if (errorResponse.errors && Array.isArray(errorResponse.errors)) {
            errorResponse.errors.forEach(({ handler, message }) => {
                selectors.forEach(selector => {
                    const input = document.querySelector(`${selector}[name="${handler}"]`);
                    if (input) {
                        input.classList.add("is-invalid");
                        const errorMessageElement = input.nextElementSibling;
                        if (errorMessageElement) {
                            errorMessageElement.innerHTML = Utils.ucfirst(message);
                        }
                        errorFields.add(handler);
                    }
                })
            });
        }



        selectors.forEach(selector => {
            const allFields = document.querySelectorAll(selector);
            allFields.forEach(field => {
                let name = field.getAttribute('name');
                if (!errorFields.has(name)) {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                    const errorMessageElement = field.nextElementSibling;
                    if (errorMessageElement) {
                        errorMessageElement.classList.remove('invalid-feedback')
                        errorMessageElement.classList.add('valid-feedback')
                        errorMessageElement.innerHTML = 'Looks good!';
                    }
                }
            })
        });
    }


    static ucfirst(string) {
        string = String(string || '');
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static displayToastMessage(selector, message, color, ev) {
        try {
            const toast = document.querySelector(selector);
            toast.classList.add(color);
            const toastBody = document.querySelector(`${selector} .toast-body`);
            toastBody.innerHTML = message;
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
            toastBootstrap.show();
            setTimeout(() => {
                toastBootstrap.hide();
                ev();
            }, 3000)
            return;
        } catch (err) {
            console.error(err);
        }
    }

    static resetPlaceholders(selectors = ['input', 'select']) {
        const validityClasses = ['is-invalid', 'is-valid']
        selectors.forEach(selector => {
            let inputs = document.querySelectorAll(selector);
            inputs.forEach(input => {
                validityClasses.forEach(classname => {
                    if (input.classList.contains(classname)) {
                        input.classList.remove(classname)
                    }
                })
                const errorElement = input.nextElementSibling
                if (errorElement && errorElement.classList.contains('valid-feedback')) {
                    errorElement.classList.remove('valid-feedback');
                    errorElement.classList.add('invalid-feedback');
                }
            })
        })
    }

    static successHandlerV1(data, form) {
        Utils.displayToastMessage('.toast', data.message, 'bg-success', () => {
            form.reset();
            Utils.resetPlaceholders();
        })
    }

}

export default Utils;
