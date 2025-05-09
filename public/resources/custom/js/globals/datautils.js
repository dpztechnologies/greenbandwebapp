import Utils from "./utils.js";
import { RenderAdminsTable } from '../spadmin/renders.js';

async function getAdminsTable(endpoint) {
    await Utils.getData({
        endpoint: endpoint,
        beforeSend: RenderAdminsTable.beforeSend,
        success: RenderAdminsTable.success,
        fail: RenderAdminsTable.fail,
        handler: RenderAdminsTable.display
    });
}

export { getAdminsTable };