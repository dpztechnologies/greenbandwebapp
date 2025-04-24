import Utils from './utils.js';


document.addEventListener('DOMContentLoaded', async () => {
    await Utils.getData('#adminsTable', renderAdminsTable);
    processLogout();
})


function processLogout() {
    const logoutHandler = document.getElementById('logoutController')
    logoutHandler.onclick = async () => {
        await Utils.processLogout('/login');
    }
    return;
}



/**
 * Renders a table of admin data into a selected DOM element.
 *
 * @param {string} selector - The CSS selector of the target table body or container.
 * @param {Array<Object>} data - The array of admin data objects.
 */
function renderAdminsTable(selector, data) {
    const render = document.querySelector(selector);
    if (!render) return;

    const rows = data.map(item => {
        const statusClass = item.status === 'Online' ? 'bg-success' : 'bg-secondary';
        const isChecked = item.can_access === 1 ? 'checked' : '';

        return `
            <tr>
                <td>${item.firstname} ${item.lastname}</td>
                <td class="d-none d-md-table-cell">${item.email}</td>
                <td class="d-none d-md-table-cell">
                    <div class="d-flex align-items-center">
                        ${item.status}
                        <div class="p-2 rounded-circle ${statusClass} ms-2"></div>
                    </div>
                </td>
                <td class="d-none d-md-table-cell">
                    <div class="d-flex justify-content-center">
                        <div class="form-check form-switch">
                            <input class="form-check-input form-check-lg" style="transform: scale(1.5);"
                                type="checkbox" id="flexSwitch" ${isChecked}>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="d-flex justify-content-start align-items-center">
                        <a class="me-2" title="View">
                            <!-- Eye Icon -->
                           <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M21.544 11.545C21.848 11.971 22 12.185 22 12.5C22 12.816 21.848 13.029 21.544 13.455C20.178 15.371 16.689 19.5 12 19.5C7.31 19.5 3.822 15.37 2.456 13.455C2.152 13.029 2 12.815 2 12.5C2 12.184 2.152 11.971 2.456 11.545C3.822 9.629 7.311 5.5 12 5.5C16.69 5.5 20.178 9.63 21.544 11.545Z"
                                    stroke="black" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M15 12.5C15 11.7044 14.6839 10.9413 14.1213 10.3787C13.5587 9.81607 12.7956 9.5 12 9.5C11.2044 9.5 10.4413 9.81607 9.87868 10.3787C9.31607 10.9413 9 11.7044 9 12.5C9 13.2956 9.31607 14.0587 9.87868 14.6213C10.4413 15.1839 11.2044 15.5 12 15.5C12.7956 15.5 13.5587 15.1839 14.1213 14.6213C14.6839 14.0587 15 13.2956 15 12.5Z"
                                    stroke="black" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </a>
                        <a class="rounded bg-primary p-1 d-flex align-items-center me-2" title="Edit">
                            <!-- Edit Icon -->
                           <svg width="16" height="17" viewBox="0 0 16 17" fill="none"xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.4695 7.69803L12.6668 6.5007C13.0302 6.13737 13.2122 5.95537 13.3095 5.75937C13.4007 5.57534 13.4481 5.37274 13.4481 5.16737C13.4481 4.96199 13.4007 4.75939 13.3095 4.57537C13.2122 4.37937 13.0302 4.19737 12.6668 3.83403C12.3035 3.4707 12.1215 3.2887 11.9255 3.19137C11.7415 3.10018 11.5389 3.05273 11.3335 3.05273C11.1281 3.05273 10.9255 3.10018 10.7415 3.19137C10.5455 3.2887 10.3635 3.4707 10.0002 3.83403L8.78749 5.0467C9.43258 6.15111 10.3577 7.06568 11.4695 7.69803ZM7.81816 6.01603L3.23816 10.596C2.95416 10.88 2.81282 11.0214 2.71949 11.196C2.62616 11.3694 2.58682 11.566 2.50882 11.9594L2.09816 14.0107C2.05416 14.232 2.03149 14.3427 2.09482 14.406C2.15816 14.4694 2.26816 14.4467 2.49016 14.4027L4.54149 13.992C4.93482 13.914 5.13149 13.8747 5.30549 13.7814C5.47949 13.688 5.62082 13.5467 5.90416 13.2634L10.4975 8.67003C9.41885 7.99477 8.50351 7.08854 7.81749 6.0167"
                                fill="white" />
                            </svg>
                        </a>
                        <a class="rounded bg-danger p-1 d-flex align-items-center me-2" title="Delete">
                            <!-- Delete Icon -->
                             <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.3333 3.83398C13.5101 3.83398 13.6797 3.90422 13.8047 4.02925C13.9298 4.15427 14 4.32384 14 4.50065C14 4.67746 13.9298 4.84703 13.8047 4.97206C13.6797 5.09708 13.5101 5.16732 13.3333 5.16732H12.6667L12.6647 5.21465L12.0427 13.9287C12.0187 14.265 11.8682 14.5799 11.6214 14.8097C11.3746 15.0395 11.0499 15.1673 10.7127 15.1673H5.28667C4.94943 15.1673 4.62471 15.0395 4.37792 14.8097C4.13114 14.5799 3.98061 14.265 3.95667 13.9287L3.33467 5.21532L3.33333 5.16732H2.66667C2.48986 5.16732 2.32029 5.09708 2.19526 4.97206C2.07024 4.84703 2 4.67746 2 4.50065C2 4.32384 2.07024 4.15427 2.19526 4.02925C2.32029 3.90422 2.48986 3.83398 2.66667 3.83398H13.3333ZM9.33333 1.83398C9.51014 1.83398 9.67971 1.90422 9.80474 2.02925C9.92976 2.15427 10 2.32384 10 2.50065C10 2.67746 9.92976 2.84703 9.80474 2.97206C9.67971 3.09708 9.51014 3.16732 9.33333 3.16732H6.66667C6.48986 3.16732 6.32029 3.09708 6.19526 2.97206C6.07024 2.84703 6 2.67746 6 2.50065C6 2.32384 6.07024 2.15427 6.19526 2.02925C6.32029 1.90422 6.48986 1.83398 6.66667 1.83398H9.33333Z"
                                fill="white" />
                            </svg>
                        </a>
                    </div>
                </td>
            </tr>
        `;
    });

    render.innerHTML = rows.join('');
}





