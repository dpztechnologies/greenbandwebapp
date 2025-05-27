import Utils from "./utils.js";
import { getAdminsTable } from "./datautils.js";

const formRegister = ['admin-registration', 'admin-update', 'user-registration'];


function formEvents(form) {
    switch (form) {
        case 'admin-registration':
            Utils.dismissModal('modal');
            getAdminsTable(Utils.getEndpoint('view-admins') + '?limit=8');
            break;
        case 'admin-update':
            Utils.dismissModal('modal');
            getAdminsTable(Utils.getEndpoint('view-admins') + '?limit=8');
            break;
    }
    return;
}


function handleFormEvent(form) {
    return Utils.handleFormEvents(formRegister, form, formEvents, form);
}


export { handleFormEvent }

