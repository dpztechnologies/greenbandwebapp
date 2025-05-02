import Utils from "./utils.js";
import { viewAdminsTable } from "./datautils.js";

const formRegister = ['admin-registration', 'user-registration'];


function formEvents(form) {
    switch (form) {
        case 'admin-registration':
            Utils.dismissModal('modal');
            viewAdminsTable(5);
            break;
    }
    return;
}


function handleFormEvent(form) {
    return Utils.handleFormEvents(formRegister, form, formEvents, form);
}


export { handleFormEvent }

