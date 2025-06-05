import FormController from "../controllers/form.js";
import Utils from "../global/utils.js";
import { form, formButton, buttonOnSubmit, buttonOnReceivedFeedback } from "../components/formselectors.js";
import Endpoints from "./endpoints.js";


class FormHandler {
    static handleRequest() {
        FormController.submit(form, (form) => {
            Utils.displayButtonAnimation(true, buttonOnSubmit);
            let formData = new FormData(form);
            formData.append('form', Utils.getFormId(form));
            const options = {
                method: 'POST',
                body: formData
            }
            FormController.postData(form, Endpoints, options, async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
                    Utils.disableElement(formButton, true);
                    Utils.successHandler(data, form, () => {
                        Utils.disableElement(formButton, false);
                        Utils.handleRedirect(data);
                    })
                } else {
                    let error = JSON.parse(await response.text());
                    switch (response.status) {
                        case 400:
                            Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
                            return Utils.handleFormErrors(error);
                        case 403:
                            Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
                            return Utils.displayToastError(`Login request failed:${error.message}`, false, 10000)
                        default:
                            Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
                            Utils.displayToastError(`${error.message} ${error.error}`, false, 3000)
                            return;
                    }
                }
            });
        })
    }
}

export default FormHandler;
