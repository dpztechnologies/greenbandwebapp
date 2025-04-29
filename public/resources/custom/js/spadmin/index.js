import Utils from '../globals/utils.js';
import { RenderAdminProfile, RenderAdminsTable } from './renders.js';

document.addEventListener('DOMContentLoaded', async () => {

    /**
     * Admins profile
     */

    await Utils.getData({
        endpoint: Utils.getEndpoint('view-admin'),
        beforeSend: RenderAdminProfile.beforeSend,
        success: RenderAdminProfile.success,
        fail: RenderAdminProfile.fail,
        handler: RenderAdminProfile.display,
    })

    /**
     * Admins Table
     */
    await viewAdminsTable(5)

    /**
     * Format table on Limit Change
     */
    formatTableOnLimitChange("adminsTable");

    Utils.logout('logoutController');
})



function formatTableOnLimitChange(table) {
    const tableLimit = document.getElementById("tableLimit");
    const tbody = document.getElementById(table);
    tableLimit.onchange = async (e) => {
        e.preventDefault();
        tbody.innerHTML = null;
        await viewAdminsTable(tableLimit.value)
    }
}


async function viewAdminsTable(limit) {
    await Utils.getData({
        endpoint: `${Utils.getEndpoint('view-admins')}/${limit}`,
        beforeSend: RenderAdminsTable.beforeSend,
        success: RenderAdminsTable.success,
        fail: RenderAdminsTable.fail,
        handler: RenderAdminsTable.display
    });
}




















