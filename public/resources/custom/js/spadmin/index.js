import Utils from '../global/utils.js';
import { RenderAdminProfile } from './renders.js';
import { DataHandler } from './datahandler.js';
import { TableController as Tables } from '../controllers/tables.js';
import FormHandler from './formhandler.js';
import LogoutController from '../controllers/logout.js';
import Endpoints from './endpoints.js';


Utils.toggleSidebar('.sidebarController')

Utils.setEndpointSource(Endpoints);

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
    LogoutController.logout('logoutController');


    /**
     * ---------------------------------------------------------------------------------------------------------------------
     * HANDLE FORM REQUESTS
     * ---------------------------------------------------------------------------------------------------------------------
    */
    FormHandler.handleRequests();

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
    await DataHandler.getAdminsTable(`${endPoints['view-admins']}?limit=${limit}`)
    /**
     * Set table limit
     */
    Tables.setLimit(limit);
    /**
     * Set table totals
     */
    Tables.call(DataHandler.getAdminsTable)
        .setCount(count)
        .setTotals(1, limit);
    /**
     * Format table on Limit Change
     */
    Tables.call(DataHandler.getAdminsTable)
        .setUrl(endPoints['view-admins'])
        .setCount(count)
        .formatTableOnLimitChange()
    /**
     * Get table controls
     */
    Tables.call(DataHandler.getAdminsTable)
        .setUrl(endPoints['admins-paginate'])
        .setCount(count)
        .getControls()
    /**
     * Search Table
     */
    Tables.call(DataHandler.getAdminsTable)
        .setUrl(endPoints['search-admin'])
        .setFallbackUrl(`${endPoints['view-admins']}?limit=8}`)
        .search();
    /**
     * Delete row
     */
    Tables.call(DataHandler.getAdminsTable)
        .setUrl(endPoints['delete-admin'])
        .deleteRow(DataHandler.getAdminDeletePrompt);
    /**
     * Edit row
     */
    Tables.call(DataHandler.editAdmin)
        .setUrl(endPoints['view-admin'])
        .editRow();
    /**
     * Render Admins Registration forms
     */
    DataHandler.getAdminRegistrationForm()
})























