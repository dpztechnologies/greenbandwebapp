import Utils from "../global/utils.js";
import { RenderAdminAvatar, RenderAdminProfile } from './renders.js';
import Endpoints from './endpoints.js';
import LogoutController from "../controllers/logout.js";


Utils.toggleSidebar('.sidebarController')

Utils.setEndpointSource(Endpoints);
/**
* ---------------------------------------------------------------------------------------------------------------------
* ADMINS AVATAR
* ---------------------------------------------------------------------------------------------------------------------
*/
await Utils.getData({
    endpoint: Utils.getEndpoint('current-admin'),
    beforeSend: RenderAdminAvatar.beforeSend,
    success: RenderAdminAvatar.success,
    fail: RenderAdminAvatar.fail,
    handler: RenderAdminAvatar.display,
})


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * LOGOUT ADMIN
 * ---------------------------------------------------------------------------------------------------------------------
*/
LogoutController.logout('logoutController');


const params = new URLSearchParams(document.location.search);
const aid = params.get("aid");
if (Utils.isDefined(aid)) {
    Utils.getData({
        endpoint: Utils.getEndpoint("show-admin-profile") + `?id=${aid}`,
        beforeSend: RenderAdminProfile.beforeSend,
        success: RenderAdminProfile.success,
        fail: RenderAdminProfile.fail,
        handler: RenderAdminProfile.display
    })
}






