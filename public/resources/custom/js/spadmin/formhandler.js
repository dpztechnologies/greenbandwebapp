import Utils from "../global/utils.js";
import FormController from "../controllers/form.js";
import { formEvents, formRegister } from "./formEvents.js";
import { form, formButton, buttonOnSubmit, buttonOnReceivedFeedback } from "../components/formselectors.js";
import Endpoints from "./endpoints.js";
class FormHandler {
    static handleRequests() {
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
                        Utils.handleFormEvents(formRegister, Utils.getFormId(form), formEvents)
                    })
                } else {
                    let error = JSON.parse(await response.text());
                    if (response.status === 400) {
                        Utils.displayButtonAnimation(false, buttonOnReceivedFeedback);
                        return Utils.handleFormErrors(error);
                    } else {
                        let message = error.message;
                        let errorText = error.error
                        Utils.displayToastError(`${message} ${errorText}`)
                        return;
                    }
                }
            });
        })
    }
}


export default FormHandler;