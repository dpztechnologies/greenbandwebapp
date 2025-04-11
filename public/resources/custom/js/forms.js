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
    postData(form, options)
}




async function postData(form, options) {
    try {
        const endpoint = Utils.getUrl(Utils.getFormEndpoint(FormHandler, form));
        const response = await fetch(endpoint, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            let error = JSON.parse(await response.text());
            return Utils.handleFormErrors(error);
        }
    } catch (err) {
        console.error(err.message);
    }
}