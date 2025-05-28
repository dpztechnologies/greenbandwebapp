import Utils from "../global/utils.js";
import { DataHandler } from "./datahandler.js";
import Endpoints from "./endpoints.js";

Utils.setEndpointSource(Endpoints);


const formRegister = ['admin-registration', 'admin-update'];


function formEvents(form) {
    switch (form) {
        case 'admin-registration':
            Utils.dismissModal('modal');
            DataHandler.getAdminsTable(Utils.getEndpoint('view-admins') + '?limit=8');
            break;
        case 'admin-update':
            Utils.dismissModal('modal');
            DataHandler.getAdminsTable(Utils.getEndpoint('view-admins') + '?limit=8');
            break;
    }
    return;
}

export { formEvents, formRegister }

