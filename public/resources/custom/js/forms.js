import Utils from "./utils.js";


/**
 * Defines all forms and their endpoints
 */
const FormHandler = {
    'admin-registration': '/process-registration',
    'admin-login': '/process-login'
}

const form = document.querySelector("form");
const formButton = 'button[type="submit"]'
const buttonOnSubmit = { selector: formButton, disabled: true, text: 'Please Wait' }
const buttonOnReceivedFeedback = { selector: formButton, disabled: false, text: 'Register Admin' }

form.onsubmit = (e) => {
    e.preventDefault();
    Utils.displayButtonAnimation(true, buttonOnSubmit);
    let formData = new FormData(form);
    formData.append('form', Utils.getFormId(form));
    const options = {
        method: 'POST',
        body: formData
    }
    postData(form, options, Utils.successHandlerV1);
}





async function postData(form, options, successHandler) {
    try {
        const endpoint = Utils.getUrl(Utils.getFormEndpoint(FormHandler, form));
        const response = await fetch(endpoint, options);
        if (response.ok) {
            const data = await response.json();
            Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
            Utils.disableElement(formButton, true);
            successHandler(data, form, () => {
                Utils.disableElement(formButton, false);
            })
        } else {
            Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
            let error = JSON.parse(await response.text());
            return Utils.handleFormErrors(error);
        }
    } catch (err) {
        console.error(err);
    }
}

