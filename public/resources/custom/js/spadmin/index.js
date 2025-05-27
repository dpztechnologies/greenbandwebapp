import Utils from '../globals/utils.js';
import { RenderAdminProfile } from './renders.js';
import { getAdminsTable, editAdmin } from '../globals/datautils.js';
import Tables from '../globals/tables.js';


const endPoints = {
    'view-admins': Utils.getEndpoint('view-admins'),
    'admins-paginate': Utils.getEndpoint('admin-paginate'),
    'search-admin': Utils.getEndpoint('search-admin'),
    'delete-admin': Utils.getEndpoint('delete-admin'),
    'admins-count': '/admins/count',
    'view-admin': '/view/admin'
}

document.addEventListener('DOMContentLoaded', async () => {

    /**
     * ---------------------------------------------------------------------------------------------------------------------
     * ADMINS PROFILE
     * ---------------------------------------------------------------------------------------------------------------------
    */
    await Utils.getData({
        endpoint: Utils.getEndpoint('current-admin'),
        beforeSend: RenderAdminProfile.beforeSend,
        success: RenderAdminProfile.success,
        fail: RenderAdminProfile.fail,
        handler: RenderAdminProfile.display,
    })

    /**
     * ---------------------------------------------------------------------------------------------------------------------
     * LOGOUT ADMIN
     * ---------------------------------------------------------------------------------------------------------------------
    */
    Utils.logout('logoutController');

    /**
     * ---------------------------------------------------------------------------------------------------------------------
     * ADMINS TABLE
     * ---------------------------------------------------------------------------------------------------------------------
    */

    /**
     * Set table name
     */
    Tables.setName('admins');
    /**
     * Set default limit size  
     */
    const limit = 8
    /**
     * Set table count
     */
    const count = await Tables.getCount(endPoints['admins-count']);
    /**
     * Get admins table
     */
    await getAdminsTable(`${endPoints['view-admins']}?limit=${limit}`)
    /**
     * Set table limit
     */
    Tables.setLimit(limit);
    /**
     * Set table totals
     */
    Tables.call(getAdminsTable)
        .setCount(count)
        .setTotals(1, limit);
    /**
     * Format table on Limit Change
     */
    Tables.call(getAdminsTable)
        .setUrl(endPoints['view-admins'])
        .setCount(count)
        .formatTableOnLimitChange()
    /**
     * Get table controls
     */
    Tables.call(getAdminsTable)
        .setUrl(endPoints['admins-paginate'])
        .setCount(count)
        .getControls()
    /**
     * Search Table
     */
    Tables.call(getAdminsTable)
        .setUrl(endPoints['search-admin'])
        .setFallbackUrl(`${endPoints['view-admins']}?limit=8}`)
        .search();
    /**
     * Delete row
     */
    Tables.call(getAdminsTable)
        .setUrl(endPoints['delete-admin'])
        .deleteRow();
    /**
     * Edit row
     */
    Tables.call(editAdmin)
        .setUrl(endPoints['view-admin'])
        .editRow();
})























