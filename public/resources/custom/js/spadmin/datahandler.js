import Utils from '../global/utils.js';
import { RenderAdminsTable } from '../spadmin/renders.js';
import Forms from "../spadmin/forms.js";
class DataHandler {


    static async getAdminsTable(endpoint) {
        await Utils.getData({
            endpoint: endpoint,
            beforeSend: RenderAdminsTable.beforeSend,
            success: RenderAdminsTable.success,
            fail: RenderAdminsTable.fail,
            handler: RenderAdminsTable.display
        });
    }

    static async editAdmin(res) {

        const modal = new bootstrap.Modal(document.getElementById('modal'))
        const heading = document.querySelector('#modal .modal-header h5');
        const modalPosition = document.querySelector('#modal .modal-dialog');
        const form = document.querySelector('#modal form')
        form.innerHTML = Forms.AdminUpdate();
        const firstname = document.querySelector('#modal form input[name="firstname"]');
        const lastname = document.querySelector('#modal form input[name="lastname"]');
        const role = document.querySelector('#modal form select[name="role"]');
        const phonenumber = document.querySelector('#modal form input[name="phone-no"]');
        const password = document.querySelector('#modal form input[name="password"]');
        const email = document.querySelector('#modal form input[name="email"]');
        const button = document.querySelector('#modal form button[type="submit"]');
        const data = res[0]
        const hiddenInput = document.createElement('input');


        Utils.classListActions('add', ['modal-dialog-centered'], modalPosition);

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

    static async getAdminRegistrationForm() {
        const form = document.querySelector('#modal .modal-body form');
        const heading = document.querySelector('#modal .modal-header h5');
        const registerBtn = document.querySelector('.registerAdminBtn');
        const modalPosition = document.querySelector('#modal .modal-dialog');

        Utils.classListActions('add', ['modal-dialog-centered'], modalPosition);

        registerBtn.addEventListener('click', () => {
            form.innerHTML = Forms.AdminRegistaration();
            form.setAttribute('id', 'admin-registration');
            heading.innerHTML = 'Admin Registration Form'
        })


    }

    static getAdminDeletePrompt() {
        return new Promise((resolve) => {
            const modalPosition = document.querySelector('#modal .modal-dialog');
            const modal = document.getElementById('modal');
            const modalDisplay = new bootstrap.Modal(modal);
            const modalBody = document.querySelector('#modal .modal-body');
            modalBody.innerHTML = Forms.AdminDelete();
            const heading = document.querySelector('#modal .modal-header h5');
            heading.innerHTML = "Delete Admin"
            const deleteItem = document.getElementById("deleteItem");
            const cancelDelete = document.getElementById("cancelDelete");
            const input = document.getElementById("deleteInput");
            Utils.classListActions('remove', ['modal-dialog-centered'], modalPosition);
            modalDisplay.show();
            deleteItem.onclick = () => {
                const value = input.value.trim();
                const feedback = input.nextElementSibling;

                if (!value) {
                    input.classList.add('is-invalid');
                    feedback.textContent = 'DELETE is required';
                } else if (value !== 'DELETE') {
                    input.classList.add('is-invalid');
                    feedback.textContent = 'Invalid word - must be uppercase DELETE';
                } else {
                    input.classList.remove('is-invalid');
                    modalDisplay.hide();
                    resolve(true);
                }
            };
            cancelDelete.onclick = () => {
                modalDisplay.hide();
                resolve(false);
            };
        });
    }

    static getAdminAccess(data) {
        if (data.success) {
            Utils.displayToastSuccess(data.message, false, 6000)
        } else {
            Utils.displayToastError(data.message, false, 6000);
        }
        return;
    }


}

export { DataHandler };