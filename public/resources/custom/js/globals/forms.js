import Utils from "./utils.js";
import Endpoints from "./endpoints.js";
import { handleFormEvent } from "./formEvents.js";

const form = document.querySelector("form");
const formButton = 'button[type="submit"]'
const buttonOnSubmit = { selector: formButton, disabled: true }
const buttonOnReceivedFeedback = { selector: formButton, disabled: false }

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
        const endpoint = Utils.getUrl(Utils.getFormEndpoint(Endpoints, form));
        const response = await fetch(endpoint, options);
        if (response.ok) {
            const data = await response.json();
            Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
            Utils.disableElement(formButton, true);
            successHandler(data, form, () => {
                Utils.disableElement(formButton, false);
                Utils.handleRedirect(data);
                handleFormEvent(Utils.getFormId(form));
            })
        } else {
            let error = JSON.parse(await response.text());
            if (response.status === 400) {
                Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
                return Utils.handleFormErrors(error);
            } else {
                let message = error.message;
                let errorText = error.error
                displayToastError(`${message} ${errorText}`)
                return;
            }
        }
    } catch (err) {
        console.error(err);
        displayToastError(err)
        return;
    }
}


function displayToastError(err) {
    Utils.getError('Something unexpected happened while processing your request', err, () => {
        Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
    })
    return
}
