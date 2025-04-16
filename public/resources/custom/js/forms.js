import Utils from "./utils.js";


/**
 * Defines all forms and their endpoints
 */
const FormHandler = {
    'admin-registration': '/process-registration',
    'admin-login': '/process-login'
}

const form = document.querySelector("form");


form.onsubmit = (e) => {
    e.preventDefault();
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
            successHandler(data, form)
        } else {
            let error = JSON.parse(await response.text());
            return Utils.handleFormErrors(error);
        }
    } catch (err) {
        console.error(err);
    }
}

