import Utils from "./utils.js";
import { RenderAdminsTable } from '../spadmin/renders.js';

async function viewAdminsTable(limit) {
    await Utils.getData({
        endpoint: `${Utils.getEndpoint('view-admins')}/${limit}`,
        beforeSend: RenderAdminsTable.beforeSend,
        success: RenderAdminsTable.success,
        fail: RenderAdminsTable.fail,
        handler: RenderAdminsTable.display
    });
}

export { viewAdminsTable };