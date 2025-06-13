import Utils from '../global/utils.js';
import { TableController as Tables } from '../controllers/tables.js';
import DateTime from '../controllers/datetime.js';
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
                            <input class="form-check-input form-check-lg adminCanAccess" style="transform: scale(1.5);"
                                type="checkbox" id="flexSwitch" ${isChecked}>
                        </div>
                    </div>
                </td>
                <td>
                    ${Tables.tableActions(`/super-admin/admins/show?aid=${item.aid}`)}
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


class RenderAdminAvatar {

    static #adminAvatarSpinner = '#adminAvatar .spinner';

    static #adminAvatar = '#adminAvatar h1';

    static #adminDetailsFirstname = '#adminDetails .firstname';

    static #adminDetailsRole = '#adminDetails .role';

    static beforeSend() {
        return false;
    }

    static display(data) {
        //Avatar
        Utils.classListActions('add', ['d-none'], RenderAdminAvatar.#adminAvatarSpinner);
        const avatarElement = document.querySelector(RenderAdminAvatar.#adminAvatar)
        avatarElement.classList.remove('d-none');
        const avatar = data.firstname.slice(0, 1).toUpperCase();
        avatarElement.innerHTML = avatar;
        // Role
        const roleElement = document.querySelector(RenderAdminAvatar.#adminDetailsRole);
        roleElement.classList.remove('d-none');
        roleElement.innerHTML = data.role;
        //Firstname
        const firstnameElement = document.querySelector(RenderAdminAvatar.#adminDetailsFirstname);
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


class RenderAdminProfile {
    static #adminHeader = '#adminHeader';

    static #aboutAdmin = '#aboutAdmin';

    static #adminActivity = "#adminActivity";

    static #adminBreadcrumb = "#adminBreadcrumb";

    static beforeSend() {
        function beforeLoadCallback(target) {
            document.querySelector(target).innerHTML = `
          <div class="d-flex align-items-center justify-content-center gap-2 flex-column">
            <div class="spinner-border text-secondary" role="status" style="width: 1.5rem; height: 1.5rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span>Please wait...</span>
          </div>
        `
        }
        beforeLoadCallback(RenderAdminProfile.#adminHeader);
        beforeLoadCallback(RenderAdminProfile.#aboutAdmin);
        beforeLoadCallback(RenderAdminProfile.#adminActivity);
        beforeLoadCallback(RenderAdminProfile.#adminBreadcrumb);
    }

    static display(data) {
        const statusClass = data.status === 'Online' ? { bg: 'bg-success', text: 'text-success' } : { bg: 'bg-secondary', text: 'text-secondary' };
        const permission = data.can_access === 1 ? { status: 'checked', granted: true } : { status: '', granted: false };
        const roleBadge = `
                <span class="badge ${data.role === 'System Admin' ? 'bg-primary' : 'bg-success'}">
                    ${data.role === 'System Admin' ? 'SY' : 'SP'}
                </span>`;
        RenderAdminProfile.#renderAdminBreadCrumb(data);
        RenderAdminProfile.#renderAdminHeader(data, statusClass, roleBadge);
        RenderAdminProfile.#renderAdminAbout(data, permission);
        RenderAdminProfile.#renderAdminActivity(data);
    }

    static async success(res, handler) {
        const data = await res.json();
        handler(data[0]);
        return
    }

    static fail(error) {
        Utils.getError('Something unexpected happened while loading admins admins profile', error);
    }

    static #getTarget(selector) {
        return document.querySelector(selector);
    }

    static #renderAdminHeader(data, statusClass, roleBadge) {
        RenderAdminProfile.#getTarget(RenderAdminProfile.#adminHeader).innerHTML = `
        <div class="row my-4">
            <!-- Avatar -->
                <div class="col-md-1 d-flex justify-content-start align-items-start">
                    <div class="rounded-circle p-3 bg-primary avatar-lg" id="adminAvatarLarge">
                        <h1 class="m-0 text-white text-center text-regular">${data.firstname.slice(0, 1).toUpperCase()}</h1>
                    </div>
                </div>

                <!-- Name -->
                <div class="col-lg-2 col-md-4  mt-md-5 mt-4">
                    <h6 class="text-muted text-light">Name</h6>
                    <h5 class="text-primary text-medium">${data.firstname} ${data.lastname}</h5>
                </div>

                <!-- Email -->
                <div class="col-lg-3 col-md-4 mt-md-5 mt-4">
                    <h6 class="text-muted text-light">Email</h6>
                    <h5 class="text-primary text-medium">${data.email}</h5>
                </div>

                 <!-- Role -->
                <div class="col-lg-2 col-md-4  mt-md-5 mt-4">
                    <h6 class="text-muted text-light">Role</h6>
                    <h6 class="text-secondary">${roleBadge} ${data.role}</h6>
                </div>

                <!-- Status -->
                <div class="col-md-2 mt-md-5 mt-4">
                    <h6 class="text-muted text-light">Status</h6>
                    <div class="d-flex align-items-center">
                        <div class="p-2 rounded-circle ${statusClass.bg}"></div>
                        <span class="${statusClass.text}">&nbsp; ${data.status}</span>
                    </div>
                </div>
                

                <!-- Options -->
                <div class="col-lg-2 col-md-1 mt-md-5 mt-4 d-flex justify-content-end">
                    
                <div class="dropdown">
                <a class="me-4 dropdown-toggle" href="#" role="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="8" fill="#76009F" fill-opacity="0.1" />
                            <path
                                d="M18.5 24.75C18.9142 24.75 19.25 24.4142 19.25 24C19.25 23.5858 18.9142 23.25 18.5 23.25C18.0858 23.25 17.75 23.5858 17.75 24C17.75 24.4142 18.0858 24.75 18.5 24.75Z"
                                stroke="#76009F" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path
                                d="M24 24.75C24.4142 24.75 24.75 24.4142 24.75 24C24.75 23.5858 24.4142 23.25 24 23.25C23.5858 23.25 23.25 23.5858 23.25 24C23.25 24.4142 23.5858 24.75 24 24.75Z"
                                stroke="#76009F" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path
                                d="M29.5 24.75C29.9142 24.75 30.25 24.4142 30.25 24C30.25 23.5858 29.9142 23.25 29.5 23.25C29.0858 23.25 28.75 23.5858 28.75 24C28.75 24.4142 29.0858 24.75 29.5 24.75Z"
                                stroke="#76009F" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </a>

                    <ul class="dropdown-menu py-3 mt-2 shadow border-0" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item d-flex align-items-center p-2 px-3" href="#">
                           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4695 7.19803L12.6668 6.0007C13.0302 5.63737 13.2122 5.45537 13.3095 5.25937C13.4007 5.07534 13.4481 4.87274 13.4481 4.66737C13.4481 4.46199 13.4007 4.25939 13.3095 4.07537C13.2122 3.87937 13.0302 3.69737 12.6668 3.33403C12.3035 2.9707 12.1215 2.7887 11.9255 2.69137C11.7415 2.60018 11.5389 2.55273 11.3335 2.55273C11.1281 2.55273 10.9255 2.60018 10.7415 2.69137C10.5455 2.7887 10.3635 2.9707 10.0002 3.33403L8.78749 4.5467C9.43258 5.65111 10.3577 6.56568 11.4695 7.19803ZM7.81816 5.51603L3.23816 10.096C2.95416 10.38 2.81282 10.5214 2.71949 10.696C2.62616 10.8694 2.58682 11.066 2.50882 11.4594L2.09816 13.5107C2.05416 13.732 2.03149 13.8427 2.09482 13.906C2.15816 13.9694 2.26816 13.9467 2.49016 13.9027L4.54149 13.492C4.93482 13.414 5.13149 13.3747 5.30549 13.2814C5.47949 13.188 5.62082 13.0467 5.90416 12.7634L10.4975 8.17003C9.41885 7.49477 8.50351 6.58854 7.81749 5.5167" fill="#76009F"/>
                            </svg>
                            <span class="ms-2 text-secondary">Edit</span>
                        </a></li>
                    <li><a class="dropdown-item d-flex align-items-center p-2 px-3" href="#">
                           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3333 3.33398C13.5101 3.33398 13.6797 3.40422 13.8047 3.52925C13.9298 3.65427 14 3.82384 14 4.00065C14 4.17746 13.9298 4.34703 13.8047 4.47206C13.6797 4.59708 13.5101 4.66732 13.3333 4.66732H12.6667L12.6647 4.71465L12.0427 13.4287C12.0187 13.765 11.8682 14.0799 11.6214 14.3097C11.3746 14.5395 11.0499 14.6673 10.7127 14.6673H5.28667C4.94943 14.6673 4.62471 14.5395 4.37792 14.3097C4.13114 14.0799 3.98061 13.765 3.95667 13.4287L3.33467 4.71532L3.33333 4.66732H2.66667C2.48986 4.66732 2.32029 4.59708 2.19526 4.47206C2.07024 4.34703 2 4.17746 2 4.00065C2 3.82384 2.07024 3.65427 2.19526 3.52925C2.32029 3.40422 2.48986 3.33398 2.66667 3.33398H13.3333ZM9.33333 1.33398C9.51014 1.33398 9.67971 1.40422 9.80474 1.52925C9.92976 1.65427 10 1.82384 10 2.00065C10 2.17746 9.92976 2.34703 9.80474 2.47206C9.67971 2.59708 9.51014 2.66732 9.33333 2.66732H6.66667C6.48986 2.66732 6.32029 2.59708 6.19526 2.47206C6.07024 2.34703 6 2.17746 6 2.00065C6 1.82384 6.07024 1.65427 6.19526 1.52925C6.32029 1.40422 6.48986 1.33398 6.66667 1.33398H9.33333Z" fill="#F72B50"/>
                            </svg>
                            <span class="ms-2 text-danger">Delete</span>
                        </a></li>
                    <li><a class="dropdown-item d-flex align-items-center p-2 px-3" href="/super-admin/admins">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.66634 8H13.333M13.333 8L9.33301 12M13.333 8L9.33301 4" stroke="#76009F" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="ms-2 text-secondary">Go back</span>
                        </a></li>
                    </ul>
                </div>
                </div>
                
            </div>
        `
    }

    static #renderAdminBreadCrumb(data) {
        RenderAdminProfile.#getTarget(RenderAdminProfile.#adminBreadcrumb).innerHTML = `
        <ol class="breadcrumb m-0 d-inline-flex align-items-center p-3 px-md-4">
            <li class="breadcrumb-item">Dashboard</li>
            <li class="breadcrumb-item">System Admins</li>
            <li class="breadcrumb-item active adminFullname" aria-current="page"><a href="#"
                    class="text-decoration-none text-secondary">${data.firstname} ${data.lastname}</a></li>
        </ol>
        `
    }

    static #renderAdminAbout(data, permission) {
        RenderAdminProfile.#getTarget(RenderAdminProfile.#aboutAdmin).innerHTML = `
             <!-- Date added -->
                <div class="p-3 border-bottom">
                    <div class="d-flex align-items-start">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M3.99967 2.66797H11.9997C12.7069 2.66797 13.3852 2.94892 13.8853 3.44902C14.3854 3.94911 14.6663 4.62739 14.6663 5.33464V12.0013C14.6663 12.7085 14.3854 13.3868 13.8853 13.8869C13.3852 14.387 12.7069 14.668 11.9997 14.668H3.99967C3.29243 14.668 2.61415 14.387 2.11406 13.8869C1.61396 13.3868 1.33301 12.7085 1.33301 12.0013V5.33464C1.33301 4.62739 1.61396 3.94911 2.11406 3.44902C2.61415 2.94892 3.29243 2.66797 3.99967 2.66797ZM3.99967 4.0013C3.64605 4.0013 3.30691 4.14178 3.05687 4.39183C2.80682 4.64187 2.66634 4.98101 2.66634 5.33464V12.0013C2.66634 12.3549 2.80682 12.6941 3.05687 12.9441C3.30691 13.1942 3.64605 13.3346 3.99967 13.3346H11.9997C12.3533 13.3346 12.6924 13.1942 12.9425 12.9441C13.1925 12.6941 13.333 12.3549 13.333 12.0013V5.33464C13.333 4.98101 13.1925 4.64187 12.9425 4.39183C12.6924 4.14178 12.3533 4.0013 11.9997 4.0013H3.99967Z"
                                fill="#7F7184" />
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M2 6.66732C2 6.49051 2.07024 6.32094 2.19526 6.19591C2.32029 6.07089 2.48986 6.00065 2.66667 6.00065H13.3333C13.5101 6.00065 13.6797 6.07089 13.8047 6.19591C13.9298 6.32094 14 6.49051 14 6.66732C14 6.84413 13.9298 7.0137 13.8047 7.13872C13.6797 7.26375 13.5101 7.33398 13.3333 7.33398H2.66667C2.48986 7.33398 2.32029 7.26375 2.19526 7.13872C2.07024 7.0137 2 6.84413 2 6.66732ZM5.33333 1.33398C5.51014 1.33398 5.67971 1.40422 5.80474 1.52925C5.92976 1.65427 6 1.82384 6 2.00065V4.66732C6 4.84413 5.92976 5.0137 5.80474 5.13872C5.67971 5.26375 5.51014 5.33398 5.33333 5.33398C5.15652 5.33398 4.98695 5.26375 4.86193 5.13872C4.7369 5.0137 4.66667 4.84413 4.66667 4.66732V2.00065C4.66667 1.82384 4.7369 1.65427 4.86193 1.52925C4.98695 1.40422 5.15652 1.33398 5.33333 1.33398ZM10.6667 1.33398C10.8435 1.33398 11.013 1.40422 11.1381 1.52925C11.2631 1.65427 11.3333 1.82384 11.3333 2.00065V4.66732C11.3333 4.84413 11.2631 5.0137 11.1381 5.13872C11.013 5.26375 10.8435 5.33398 10.6667 5.33398C10.4899 5.33398 10.3203 5.26375 10.1953 5.13872C10.0702 5.0137 10 4.84413 10 4.66732V2.00065C10 1.82384 10.0702 1.65427 10.1953 1.52925C10.3203 1.40422 10.4899 1.33398 10.6667 1.33398Z"
                                fill="#7F7184" />
                            <path
                                d="M5.33333 8.66667C5.33333 8.84348 5.2631 9.01305 5.13807 9.13807C5.01305 9.2631 4.84348 9.33333 4.66667 9.33333C4.48986 9.33333 4.32029 9.2631 4.19526 9.13807C4.07024 9.01305 4 8.84348 4 8.66667C4 8.48986 4.07024 8.32029 4.19526 8.19526C4.32029 8.07024 4.48986 8 4.66667 8C4.84348 8 5.01305 8.07024 5.13807 8.19526C5.2631 8.32029 5.33333 8.48986 5.33333 8.66667ZM5.33333 11.3333C5.33333 11.5101 5.2631 11.6797 5.13807 11.8047C5.01305 11.9298 4.84348 12 4.66667 12C4.48986 12 4.32029 11.9298 4.19526 11.8047C4.07024 11.6797 4 11.5101 4 11.3333C4 11.1565 4.07024 10.987 4.19526 10.8619C4.32029 10.7369 4.48986 10.6667 4.66667 10.6667C4.84348 10.6667 5.01305 10.7369 5.13807 10.8619C5.2631 10.987 5.33333 11.1565 5.33333 11.3333ZM8.66667 8.66667C8.66667 8.84348 8.59643 9.01305 8.4714 9.13807C8.34638 9.2631 8.17681 9.33333 8 9.33333C7.82319 9.33333 7.65362 9.2631 7.5286 9.13807C7.40357 9.01305 7.33333 8.84348 7.33333 8.66667C7.33333 8.48986 7.40357 8.32029 7.5286 8.19526C7.65362 8.07024 7.82319 8 8 8C8.17681 8 8.34638 8.07024 8.4714 8.19526C8.59643 8.32029 8.66667 8.48986 8.66667 8.66667ZM8.66667 11.3333C8.66667 11.5101 8.59643 11.6797 8.4714 11.8047C8.34638 11.9298 8.17681 12 8 12C7.82319 12 7.65362 11.9298 7.5286 11.8047C7.40357 11.6797 7.33333 11.5101 7.33333 11.3333C7.33333 11.1565 7.40357 10.987 7.5286 10.8619C7.65362 10.7369 7.82319 10.6667 8 10.6667C8.17681 10.6667 8.34638 10.7369 8.4714 10.8619C8.59643 10.987 8.66667 11.1565 8.66667 11.3333ZM12 8.66667C12 8.84348 11.9298 9.01305 11.8047 9.13807C11.6797 9.2631 11.5101 9.33333 11.3333 9.33333C11.1565 9.33333 10.987 9.2631 10.8619 9.13807C10.7369 9.01305 10.6667 8.84348 10.6667 8.66667C10.6667 8.48986 10.7369 8.32029 10.8619 8.19526C10.987 8.07024 11.1565 8 11.3333 8C11.5101 8 11.6797 8.07024 11.8047 8.19526C11.9298 8.32029 12 8.48986 12 8.66667ZM12 11.3333C12 11.5101 11.9298 11.6797 11.8047 11.8047C11.6797 11.9298 11.5101 12 11.3333 12C11.1565 12 10.987 11.9298 10.8619 11.8047C10.7369 11.6797 10.6667 11.5101 10.6667 11.3333C10.6667 11.1565 10.7369 10.987 10.8619 10.8619C10.987 10.7369 11.1565 10.6667 11.3333 10.6667C11.5101 10.6667 11.6797 10.7369 11.8047 10.8619C11.9298 10.987 12 11.1565 12 11.3333Z"
                                fill="#7F7184" />
                        </svg>
                        <div class="ms-2">
                            <h6 class="text-secondary">Date Added</h6>
                            <h6>${DateTime.format(data.created_at, 'd/m/Y g:iA')}</h6>
                        </div>
                    </div>
                </div>

                <!-- Last logged in -->
                <div class="p-3 border-bottom">
                    <div class="d-flex align-items-start">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.99967 1.33398C11.6817 1.33398 14.6663 4.31865 14.6663 8.00065C14.6663 11.6827 11.6817 14.6673 7.99967 14.6673C4.31767 14.6673 1.33301 11.6827 1.33301 8.00065C1.33301 4.31865 4.31767 1.33398 7.99967 1.33398ZM7.99967 2.66732C6.58519 2.66732 5.22863 3.22922 4.22844 4.22941C3.22824 5.22961 2.66634 6.58616 2.66634 8.00065C2.66634 9.41514 3.22824 10.7717 4.22844 11.7719C5.22863 12.7721 6.58519 13.334 7.99967 13.334C9.41416 13.334 10.7707 12.7721 11.7709 11.7719C12.7711 10.7717 13.333 9.41514 13.333 8.00065C13.333 6.58616 12.7711 5.22961 11.7709 4.22941C10.7707 3.22922 9.41416 2.66732 7.99967 2.66732ZM7.99967 4.00065C8.16296 4.00067 8.32057 4.06062 8.44259 4.16913C8.56461 4.27763 8.64257 4.42715 8.66167 4.58932L8.66634 4.66732V7.72465L10.471 9.52932C10.5906 9.64929 10.66 9.81027 10.6652 9.97957C10.6703 10.1489 10.6109 10.3138 10.4988 10.4408C10.3868 10.5679 10.2306 10.6475 10.062 10.6636C9.89341 10.6796 9.725 10.6309 9.59101 10.5273L9.52834 10.472L7.52834 8.47198C7.42473 8.36828 7.35818 8.23332 7.33901 8.08798L7.33301 8.00065V4.66732C7.33301 4.49051 7.40325 4.32094 7.52827 4.19591C7.65329 4.07089 7.82286 4.00065 7.99967 4.00065Z"
                                fill="#7F7184" />
                        </svg>
                        <div class="ms-2">
                            <h6 class="text-secondary">Last logged in</h6>
                            <h6>${Utils.isDefined(data.last_seen) ? DateTime.format(data.last_seen, 'd/m/Y g:iA') : 'No recent activity'}</h6>
                        </div>
                    </div>
                </div>

                <!-- Can access -->
                <div class="p-3 border-bottom">
                    <div class="d-flex align-items-start">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.00033 8.66732C7.79736 8.66495 7.59854 8.72481 7.43062 8.83885C7.2627 8.9529 7.13376 9.11564 7.06113 9.30519C6.98851 9.49473 6.9757 9.70198 7.02442 9.89902C7.07315 10.0961 7.18107 10.2735 7.33366 10.4073V11.334C7.33366 11.5108 7.4039 11.6804 7.52892 11.8054C7.65395 11.9304 7.82351 12.0007 8.00033 12.0007C8.17714 12.0007 8.34671 11.9304 8.47173 11.8054C8.59675 11.6804 8.66699 11.5108 8.66699 11.334V10.4073C8.81958 10.2735 8.9275 10.0961 8.97623 9.89902C9.02495 9.70198 9.01214 9.49473 8.93952 9.30519C8.86689 9.11564 8.73795 8.9529 8.57003 8.83885C8.40212 8.72481 8.20329 8.66495 8.00033 8.66732ZM11.3337 6.00065V4.66732C11.3337 3.78326 10.9825 2.93542 10.3573 2.3103C9.73223 1.68517 8.88438 1.33398 8.00033 1.33398C7.11627 1.33398 6.26842 1.68517 5.6433 2.3103C5.01818 2.93542 4.66699 3.78326 4.66699 4.66732V6.00065C4.13656 6.00065 3.62785 6.21136 3.25278 6.58644C2.87771 6.96151 2.66699 7.47022 2.66699 8.00065V12.6673C2.66699 13.1978 2.87771 13.7065 3.25278 14.0815C3.62785 14.4566 4.13656 14.6673 4.66699 14.6673H11.3337C11.8641 14.6673 12.3728 14.4566 12.7479 14.0815C13.1229 13.7065 13.3337 13.1978 13.3337 12.6673V8.00065C13.3337 7.47022 13.1229 6.96151 12.7479 6.58644C12.3728 6.21136 11.8641 6.00065 11.3337 6.00065ZM6.00033 4.66732C6.00033 4.13688 6.21104 3.62818 6.58611 3.2531C6.96118 2.87803 7.46989 2.66732 8.00033 2.66732C8.53076 2.66732 9.03947 2.87803 9.41454 3.2531C9.78961 3.62818 10.0003 4.13688 10.0003 4.66732V6.00065H6.00033V4.66732ZM12.0003 12.6673C12.0003 12.8441 11.9301 13.0137 11.8051 13.1387C11.68 13.2637 11.5105 13.334 11.3337 13.334H4.66699C4.49018 13.334 4.32061 13.2637 4.19559 13.1387C4.07056 13.0137 4.00033 12.8441 4.00033 12.6673V8.00065C4.00033 7.82384 4.07056 7.65427 4.19559 7.52925C4.32061 7.40422 4.49018 7.33398 4.66699 7.33398H11.3337C11.5105 7.33398 11.68 7.40422 11.8051 7.52925C11.9301 7.65427 12.0003 7.82384 12.0003 8.00065V12.6673Z"
                                fill="#7F7184" />
                        </svg>
                        <div class="ms-2 w-100">
                            <h6 class="text-secondary">Access</h6>
                            <div class="row">
                                <h6 class="col-6">${(Boolean(permission.granted) === true) ? 'Granted' : 'Not granted'}</h6>
                                <div class="form-check form-switch col-6 d-flex justify-content-end">
                                    <input class="form-check-input adminCanAccess me-3" type="checkbox"
                                        id="flexSwitch" ${permission.status}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        `
    }


    static #renderAdminActivity(data, selectedRange = 'all', customStart = null, customEnd = null, page = 1) {
        let parsedActivity = [];
        try {
            const parsed = JSON.parse(data.activity);
            if (Array.isArray(parsed)) {
                parsedActivity = parsed;
            } else {
                console.warn("Invalid activity format. Resetting to empty.");
            }
        } catch (err) {
            console.warn("Failed to parse activity JSON. Resetting to empty.");
        }

        const today = new Date();
        const logsPerPage = 6;

        const isDateInRange = (dateStr) => {
            const [day, month, year] = dateStr.split('/').map(Number);
            const date = new Date(year, month - 1, day);

            if (selectedRange === 'custom' && customStart && customEnd) {
                return date >= customStart && date <= customEnd;
            }

            const diffTime = today - date;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            switch (selectedRange) {
                case 'today':
                    return date.toDateString() === today.toDateString();
                case 'yesterday': {
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                    return date.toDateString() === yesterday.toDateString();
                }
                case '7days':
                    return diffDays >= 0 && diffDays <= 7;
                case '30days':
                    return diffDays >= 0 && diffDays <= 30;
                case 'thisMonth':
                    return (
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()
                    );
                default:
                    return true;
            }
        };


        const getIcon = (type) => {
            switch (type) {
                case 'login': return '🟢';
                case 'logout': return '🔴';
                case 'update': return '✏️';
                case 'create': return '🆕';
                case 'delete': return '🗑️';
                default: return '📌';
            }
        };

        // Filter and sort logs
        const filteredLogs = parsedActivity.filter(log => isDateInRange(log.date));
        filteredLogs.sort((a, b) => {
            const [da, ma, ya] = a.date.split('/').map(Number);
            const [db, mb, yb] = b.date.split('/').map(Number);
            const dateA = new Date(ya, ma - 1, da);
            const dateB = new Date(yb, mb - 1, db);
            if (dateA.getTime() !== dateB.getTime()) return dateB - dateA;

            const parseTime = time => {
                const [h, m, p] = time.match(/(\d+):(\d+)(AM|PM)/i).slice(1);
                const hh = (p === 'PM' && h !== '12') ? +h + 12 : (p === 'AM' && h === '12') ? 0 : +h;
                return hh * 60 + +m;
            };

            return parseTime(b.time) - parseTime(a.time);
        });

        // Pagination
        const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
        const startIdx = (page - 1) * logsPerPage;
        const paginatedLogs = filteredLogs.slice(startIdx, startIdx + logsPerPage);

        // Group by date
        const grouped = {};
        for (const log of paginatedLogs) {
            if (!grouped[log.date]) grouped[log.date] = [];
            grouped[log.date].push(log);
        }

        let activityHTML = '';
        Object.keys(grouped).forEach(date => {
            const id = `collapse-${date.replace(/\//g, '-')}`;
            const getDateLabel = (logDateStr) => {
                const [logDay, logMonth, logYear] = logDateStr.split('/').map(Number);
                const logDate = new Date(logYear, logMonth - 1, logDay);

                const todayStr = today.toDateString();
                const logStr = logDate.toDateString();

                const diffTime = today - logDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (logStr === todayStr) return 'Today';
                if (diffDays === 1) return 'Yesterday';

                if (selectedRange === '7days' || selectedRange === '30days') {
                    return `${diffDays} Day${diffDays > 1 ? 's' : ''} Ago`;
                }

                // For custom range, return the date itself (e.g., 10/6/2025)
                if (selectedRange === 'custom') return logDateStr;

                // Default fallback
                return logDateStr;
            };


            const label = getDateLabel(date)
            activityHTML += `
                <div class="p-2 border-bottom">
                    <h6 class="text-muted">
                        <button class="btn btn-sm text-primary btn-link text-decoration-none" data-bs-toggle="collapse" data-bs-target="#${id}">
                            ${label}
                        </button>
                    </h6>
                    <div id="${id}" class="collapse show">
                        ${grouped[date].map(log => `
                            <div class="p-2 my-3 border-bottom d-flex justify-content-between">
                                <h6>${getIcon(log.type)} ${log.desc}</h6>
                                <h6 class="text-muted">${log.time}</h6>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        // Pagination controls
        let paginationHTML = '';
        if (totalPages > 1) {
            paginationHTML = `
                <div class="d-flex justify-content-center mt-3">
                    <nav>
                        <ul class="pagination pagination-sm">
                            ${Array.from({ length: totalPages }, (_, i) => `
                                <li class="page-item ${page === i + 1 ? 'active' : ''}">
                                    <a href="#" class="page-link activity-page-link" data-page="${i + 1}">${i + 1}</a>
                                </li>
                            `).join('')}
                        </ul>
                    </nav>
                </div>
            `;
        }

        // Inject HTML
        RenderAdminProfile.#getTarget(RenderAdminProfile.#adminActivity).innerHTML = `
            <!-- Filter Controls -->
            <div class="d-flex justify-content-between align-items-center p-3 flex-wrap gap-2">
                <div class="d-flex flex-wrap gap-2">
                    ${['all', 'today', 'yesterday', '7days', '30days', 'thisMonth'].map(range => `
                        <button type="button" class="btn btn-outline-primary range-btn ${selectedRange === range ? 'active' : ''} me-2 mb-2" data-range="${range}">
                            ${range === 'thisMonth' ? 'This Month' : range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    `).join('')}
                    <button type="button" class="btn btn-outline-secondary me-2 mb-2" id="custom-range-btn">Custom</button>
                </div>

                <!-- Custom Range Inputs (aligned to the end) -->
                <div class="d-none ms-auto" id="custom-range-inputs">
                    <div class="d-flex align-items-end flex-wrap gap-2">
                        <div>
                            <label for="customStartDate" class="form-label mb-0">From</label>
                            <input type="date" class="form-control form-control-sm" id="customStartDate">
                        </div>
                        <div>
                            <label for="customEndDate" class="form-label mb-0">To</label>
                            <input type="date" class="form-control form-control-sm" id="customEndDate">
                        </div>
                        <div>
                            <button class="btn btn-sm btn-primary mt-3" id="applyCustomRange">Apply</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activity Logs -->
            <div>
                ${activityHTML || `<div class="p-3 text-muted d-flex align-items-center flex-column gap-2">
                        <div>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 2H6C4.89543 2 4 2.89543 4 4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V8L14 2H10Z" stroke="#6c757d" stroke-width="1.5"/>
                                <path d="M14 2V8H20" stroke="#6c757d" stroke-width="1.5"/>
                                <circle cx="11" cy="13" r="3" stroke="#6c757d" stroke-width="1.5"/>
                                <line x1="13.5" y1="15.5" x2="16" y2="18" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <p class="mt-2">No logs found</p>
                        </div>
                    </div>
                        `}

            ${paginationHTML}
            `;

        // Event Listeners
        document.querySelectorAll('.range-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                RenderAdminProfile.#renderAdminActivity(data, e.target.dataset.range);
            });
        });

        document.getElementById('custom-range-btn').addEventListener('click', () => {
            document.getElementById('custom-range-inputs').classList.toggle('d-none');
        });

        document.getElementById('applyCustomRange').addEventListener('click', () => {
            const start = new Date(document.getElementById('customStartDate').value);
            const end = new Date(document.getElementById('customEndDate').value);
            if (isNaN(start) || isNaN(end)) return alert('Please select a valid date range');
            RenderAdminProfile.#renderAdminActivity(data, 'custom', start, end);
        });

        document.querySelectorAll('.activity-page-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetPage = parseInt(e.target.dataset.page);
                RenderAdminProfile.#renderAdminActivity(data, selectedRange, customStart, customEnd, targetPage);
            });
        });
    }

}




export { RenderAdminAvatar, RenderAdminsTable, RenderAdminProfile }


