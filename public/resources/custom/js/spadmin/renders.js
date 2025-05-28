import Utils from '../global/utils.js';
import { TableController as Tables } from '../controllers/tables.js';

class RenderAdminsTable extends Tables {

    static #spinner = '#tableLazyLoading';

    static #target = '#adminsTable';

    static beforeSend() {
        Utils.displaySpinner(true, RenderAdminsTable.#spinner);
    }

    static display(data) {
        const target = document.querySelector(RenderAdminsTable.#target);
        if (!target) throw new Error(`Invalid target ${RenderAdminsTable.#target}`);

        // Start fade-out
        target.style.transition = 'opacity 900ms ease';
        target.style.opacity = 0;

        // Wait for fade-out to complete, then render data and fade in
        RenderAdminsTable.tableAnimation(900, () => {
            RenderAdminsTable.#renderData(target, data);
            target.style.opacity = 1;
        });
    }


    static #renderData(target, data) {
        if (Tables.handleEmptyRows(target, data)) return;
        let count = 1;
        const rows = data.map(item => {
            const statusClass = item.status === 'Online' ? 'bg-success' : 'bg-secondary';
            const isChecked = item.can_access === 1 ? 'checked' : '';
            const roleBadge = `
                <span class="badge ${item.role === 'System Admin' ? 'bg-primary' : 'bg-success'}">
                    ${item.role === 'System Admin' ? 'SY' : 'SP'}
                </span>`;
            return `
            <tr class="table-row" data-id="${item.aid}">
                <td class="count">${count++}</td>
                <td>${item.firstname} ${item.lastname}</td>
                <td class="d-none d-sm-table-cell">${item.email}</td>
                <td class="d-none d-md-table-cell">${roleBadge}</td>
                <td class="d-none d-md-table-cell">
                    <div class="d-flex align-items-center">
                        ${item.status}
                        <div class="p-2 rounded-circle ${statusClass} ms-2"></div>
                    </div>
                </td>
                <td class="d-none d-md-table-cell">
                    <div class="d-flex justify-content-center">
                        <div class="form-check form-switch">
                            <input class="form-check-input form-check-lg" id="adminCanAccess" style="transform: scale(1.5);"
                                type="checkbox" id="flexSwitch" ${isChecked}>
                        </div>
                    </div>
                </td>
                <td>
                    ${Tables.tableActions()}
                </td>
            </tr>
        `;
        });

        target.innerHTML = rows.join('');
    }


    static tableAnimation(duration, callback) {
        setTimeout(Utils.executeCallback(callback), duration)
    }

    static async success(res, handler) {
        Utils.displaySpinner(false, RenderAdminsTable.#spinner);
        const data = await res.json();
        handler(data)
        return;
    }

    static fail(error) {
        Utils.getError('Something unexpected happened while loading the admins table', error, () => {
            Utils.displaySpinner(false, RenderAdminsTable.#spinner);
        })
    }
}


class RenderAdminProfile {

    static #adminAvatarSpinner = '#adminAvatar .spinner';

    static #adminAvatar = '#adminAvatar h1';

    static #adminDetailsFirstname = '#adminDetails .firstname';

    static #adminDetailsRole = '#adminDetails .role';


    static beforeSend() {
        return false;
    }

    static display(data) {
        //Avatar
        Utils.classListActions('add', ['d-none'], RenderAdminProfile.#adminAvatarSpinner);
        const avatarElement = document.querySelector(RenderAdminProfile.#adminAvatar)
        avatarElement.classList.remove('d-none');
        const avatar = data.firstname.slice(0, 1).toUpperCase();
        avatarElement.innerHTML = avatar;
        // Role
        const roleElement = document.querySelector(RenderAdminProfile.#adminDetailsRole);
        roleElement.classList.remove('d-none');
        roleElement.innerHTML = data.role;
        //Firstname
        const firstnameElement = document.querySelector(RenderAdminProfile.#adminDetailsFirstname);
        firstnameElement.innerHTML = data.firstname
        return;
    }

    static async success(res, handler) {
        const data = await res.json();
        handler(data[0]);
        return
    }

    static fail(error) {
        Utils.getError('Something unexpected happened while loading admins admins profile', error);
    }

}




export { RenderAdminProfile, RenderAdminsTable }