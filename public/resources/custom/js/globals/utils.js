import Endpoints from "./endpoints.js";

/**
 * @author DPZTechnologies
 * @date Thu Apr 03 2025 15:17:25 GMT+0300 (East Africa Time)
 * @abstract Frontend Utilities
 */
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

    /**
     * Retrieves the ID attribute of a given form element.
     * 
     * @param {HTMLFormElement} form - The form element to extract the ID from.
     * @returns {string|null} - The ID of the form or null if not found.
     */
    static getFormId(form) {
        return (typeof form === 'object') ? form.getAttribute('id') : false;
    }

    /**
     * Resolves the endpoint for a form using a form-handler mapping.
     * 
     * @param {Object} FormHandler - Object mapping form IDs to endpoints.
     * @param {HTMLFormElement} form - The form whose endpoint is to be resolved.
     * @returns {string} - The endpoint associated with the form ID.
     */
    static getFormEndpoint(FormHandler, form) {
        return FormHandler[Utils.getFormId(form)];
    }


    static getEndpoint(source) {
        if (Endpoints.hasOwnProperty(source)) {
            return Endpoints[source]
        }
        throw new Error(`Invalid endpoint source ${source}`)
    }




    /**
     * Handles form field errors and applies visual feedback.
     * 
     * @param {Object} errorResponse - The error response containing validation errors.
     * @param {string[]} selectors - A list of selectors to target input fields.
     * @returns {void}
     */
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
            const allFields = document.querySelectorAll(`#${this.getFormId()} ${selector}`);
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

    /**
     * Converts the first letter of a string to uppercase.
     * 
     * @param {string} string - The input string to capitalize.
     * @returns {string} - The capitalized string.
     */
    static ucfirst(string) {
        string = String(string || '');
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Displays a toast message with dynamic content and styling.
     * 
     * @param {string} selector - The selector for the toast element.
     * @param {string} message - The message to display inside the toast.
     * @param {string} color - The class name for styling (e.g., 'bg-success').
     * @param {Function} ev - Callback function to invoke after the toast is hidden.
     * @returns {void}
     */
    static displayToastMessage(selector, message, color, ev) {
        try {
            const toast = document.querySelector(selector);
            const removeList = ['bg-success', 'bg-danger', 'bg-info', 'bg-primary', 'bg-light'];
            Utils.classListActions('remove', removeList, selector);
            Utils.classListActions('add', [color], selector);
            const toastBody = document.querySelector(`${selector} .toast-body`);
            toastBody.innerHTML = message;
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
            toastBootstrap.show();
            setTimeout(() => {
                toastBootstrap.hide();
                Utils.executeCallback(ev)
            }, 3000)
            return;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Resets validation classes and feedback messages for form elements.
     * 
     * @param {string[]} selectors - Array of CSS selectors to apply the reset to.
     * @returns {void}
     */
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

    /**
     * Displays a toast message and resets the form on success.
     * 
     * @param {Object} data - The success response containing the message.
     * @param {HTMLFormElement} form - The form to reset.
     * @param {Function} callback - The callback to execute after completion.
     * @returns {void}
     */
    static successHandlerV1(data, form, callback) {
        Utils.displayToastMessage('.toast', data.message, 'bg-success', () => {
            form.reset();
            Utils.resetPlaceholders();
            callback();
        })
        return;
    }


    /**
    * Handles client-side redirection based on the presence of a `redirect` property in the response data.
  *
  * @param {Object} data - The response object containing potential redirect information.
  * @returns {void}
  */
    static handleRedirect(data) {
        if (Object.hasOwnProperty.call(data, 'redirect')) {
            window.location.href = data.redirect;
        }
        return;
    }

    /**
     * Enables or disables a DOM element based on the given flag.
     * 
     * @param {string} selector - CSS selector for the target element.
     * @param {boolean} disable - Whether to disable (true) or enable (false) the element.
     * @returns {void}
     */
    static disableElement(selector, disable = false) {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Invalid selector ${selector}`)
        if (disable) {
            element.setAttribute('disabled', true);
        } else {
            if (element.hasAttribute('disabled')) {
                element.removeAttribute('disabled');
            }
        }
        return;
    }

    /**
     * Sets the innerHTML of the selected element if data is not empty.
     * 
     * @param {string} selector - The selector of the element to update.
     * @param {string} data - The HTML string to inject.
     * @returns {boolean|string} - False if data is empty, otherwise the updated HTML.
     */
    static writeInnerHTML(selector, data = "") {
        const element = document.querySelector(selector);
        return (element && data.length > 0) ? element.innerHTML = data : false;
    }

    /**
     * Applies the specified class list action ('add', 'remove', or 'toggle') to a single DOM element.
     * 
     * @param {string} action - The action to perform on the class list.
     * @param {string[]} classNames - Array of class names to manipulate.
     * @param {string} selector - The CSS selector of the target element.
     * @returns {void}
     */
    static classListActions(action = 'add', classNames = [], selector) {
        const element = document.querySelector(selector);
        if (!element) return;
        classNames.forEach(className => {
            switch (action) {
                case 'add':
                    (!element.classList.contains(className)) && element.classList.add(className)
                    break;
                case 'remove':
                    (element.classList.contains(className)) && element.classList.remove(className);
                    break;
                case 'toggle':
                    element.classList.toggle(className);
                    break;
            }
        })
        return;
    }

    /**
     * Manages the display of a button loading animation and disables/enables the button.
     * 
     * @param {boolean} display - Whether to show or hide the loading animation.
     * @param {Object} props - The properties for managing the button.
     * @param {string} props.selector - The button container selector.
     * @param {boolean} props.disabled - Whether to disable the button.
     * @param {string} props.text - The text to display in the button.
     * @returns {void}
     */
    static displayButtonAnimation(display = false, props = { selector: "", disabled: false }) {
        Utils.#handleButtonAnimationErrors(props)
        switch (display) {
            case true:
                return this.#buttonAnimationActions('remove', props);
            case false:
                return this.#buttonAnimationActions('add', props);
        }
    }

    /**
     * Executes class and content updates for a button animation state.
     * 
     * @param {string} action - 'add' or 'remove' to manage the loading spinner.
     * @param {Object} props - Button control properties.
     * @returns {void}
     */
    static #buttonAnimationActions(action, props) {
        Utils.classListActions(action, ['d-none'], `${props.selector} .spinner`);
        Utils.disableElement(props.selector, props.disabled);
        return;
    }

    /**
     * Validates the shape and values of props for the button animation feature.
     * 
     * @param {Object} props - The props object to validate.
     * @throws {Error} - If props are invalid or contain unexpected properties.
     * @returns {void}
     */
    static #handleButtonAnimationErrors(props) {
        if (props.selector.length < 0) {
            throw new Error('Button selector must be defined');
        }
        if (Object.keys(props).length !== 2) {
            throw new Error('Props must be 2 `selector`, `disabled`');
        }
        const validProps = ['selector', 'disabled'];
        for (let x in props) {
            if (!validProps.includes(x)) {
                throw new Error(`Invalid property ${x}`);
            }
        }
    }

    static async processLogout(redirectUrl) {
        try {
            let options = {
                'method': 'POST',
                'body': new FormData()
            }
            const res = await fetch(Utils.getEndpoint('logout'), options);
            if (res.ok) {
                const data = await res.json();
                Utils.displayToastMessage('#alert-toast', data.message, 'bg-info', () => {
                    window.location.href = redirectUrl;
                })
            }
        } catch (err) {
            console.error(err)
        }

    }


    static logout(selector) {
        const logoutHandler = document.getElementById(selector)
        logoutHandler.onclick = async () => {
            await Utils.processLogout('/login');
        }
        return;
    }

    static displaySpinner(display = false, selector) {
        switch (display) {
            case true:
                Utils.classListActions('remove', ['d-none'], selector);
                break;
            case false:
                Utils.classListActions('add', ['d-none'], selector);
                break;
        }
    }

    static async getData(handlers = { endpoint, beforeSend, success, fail, handler }) {
        handlers.beforeSend();
        try {
            const res = await fetch(handlers.endpoint);
            if (res.ok) {
                return await handlers.success(res, handlers.handler);
            } else {
                handlers.fail(await res.text());
            }
        } catch (err) {
            handlers.fail(err);
        }
    }

    static getError(message, error, callback) {
        Utils.displayToastMessage("#alert-toast",
            `${message}. Error: ${error}`,
            "bg-danger",
            Utils.executeCallback(callback)
        )
    }

    static executeCallback(callback) {
        return (typeof callback === 'function') ? callback() : () => { return false }
    }

}


export default Utils;
