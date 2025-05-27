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

async function editAdmin(res) {

    const modal = new bootstrap.Modal(document.getElementById('modal'))
    const heading = document.querySelector('#modal .modal-header h5');
    const form = document.querySelector('#modal form');
    const firstname = document.querySelector('#modal form input[name="firstname"]');
    const lastname = document.querySelector('#modal form input[name="lastname"]');
    const role = document.querySelector('#modal form select[name="role"]');
    const phonenumber = document.querySelector('#modal form input[name="phone-no"]');
    const password = document.querySelector('#modal form input[name="password"]');
    const email = document.querySelector('#modal form input[name="email"]');
    const button = document.querySelector('#modal form button[type="submit"]');
    const data = res[0]
    const hiddenInput = document.createElement('input');

    hiddenInput.setAttribute('name', 'aid');
    hiddenInput.setAttribute('value', data.aid);
    hiddenInput.setAttribute('type', 'hidden');
    form.appendChild(hiddenInput);
    heading.innerHTML = 'Update Admin'
    form.setAttribute('id', 'admin-update')
    if (password !== null) {
        password?.closest('div').remove();
        password.remove();
    }

    firstname.value = data?.firstname;
    lastname.value = data?.lastname;
    role.value = data?.role;
    phonenumber.value = data?.phone_no;
    email.value = data?.email;
    button.innerHTML = 'Update Admin';
    modal.show();

}

export { getAdminsTable, editAdmin };