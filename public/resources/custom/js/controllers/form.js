import Utils from "../global/utils.js";

class FormController {
    static submit(form, callback) {
        form.onsubmit = (e) => {
            e.preventDefault();
            callback(form);
        }
    }


    static async postData(form, endpoints, options, callback) {
        try {
            const endpoint = Utils.getUrl(Utils.getFormEndpoint(endpoints, form));
            const response = await fetch(endpoint, options);
            callback(response);
        } catch (err) {
            console.error(err);
            Utils.displayToastError(err)
            return;
        }
    }
}



export default FormController;