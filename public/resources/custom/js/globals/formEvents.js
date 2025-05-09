import Utils from "./utils.js";
import { getAdminsTable } from "./datautils.js";

const formRegister = ['admin-registration', 'user-registration'];


function formEvents(form) {
    switch (form) {
        case 'admin-registration':
            Utils.dismissModal('modal');
            getAdminsTable(5);
            break;
    }
    return;
}


function handleFormEvent(form) {
    return Utils.handleFormEvents(formRegister, form, formEvents, form);
}


export { handleFormEvent }

