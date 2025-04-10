import Utils from "./utils.js";


/**
 * Defines all forms and their endpoints
 */
const FormHandler = {
    'registrationForm': '/process-registration',
    'loginForm': '/process-login'
}

const form = document.querySelector("form");


form.onsubmit = (e) => {
    e.preventDefault();
    const options = {
        method: 'POST',
        body: new FormData(form)
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
            let error = JSON.parse(await response.text())
            let errorInput = document.querySelector(`input[name="${error.handler}"]`);
            errorInput.classList.add("is-invalid");
            let errorHandler = errorInput.nextElementSibling;
            errorHandler.innerHTML = error.message;
        }
    } catch (err) {
        console.error(err.message);
    }
}