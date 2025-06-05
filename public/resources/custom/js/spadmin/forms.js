class Forms {
    static AdminRegistaration() {
        return `
         <form method="POST" class="py-3" enctype="multipart/form-data"
                    class="needs-validation mt-3 mt-lg-0" novalidate>
            <div class="row g-3 mx-0">
                <div class="col-lg-6 form-group my-3">
                    <input type="text" class="form-control py-3" name="firstname" placeholder="Firstname" />
                    <div class="invalid-feedback mt-2">Firstname is required</div>
                </div>
                <div class="col-lg-6 form-group my-3">
                    <input type="text" class="form-control py-3" name="lastname" placeholder="Lastname" />
                    <div class="invalid-feedback mt-2">Lastname is required</div>
                </div>
                <div class="col-lg-6 form-group my-3">
                    <select name="role" class="form-select py-3">
                        <option>Super Admin</option>
                        <option>System Admin</option>
                    </select>
                    <div class="invalid-feedback mt-2">Role is required</div>
                </div>
                <div class="col-lg-6 form-group my-3">
                    <input type="text" class="form-control py-3" name="phone-no" placeholder="Phone number" />
                    <div class="invalid-feedback mt-2">Phone number is required</div>
                </div>
                <div class="col-md-12 form-group my-3">
                    <input type="email" class="form-control py-3" name="email" placeholder="Email" />
                    <div class="invalid-feedback mt-2">Email is required</div>
                </div>

                <div class="col-md-12 form-group my-3">
                    <input type="password" class="form-control py-3" name="password" placeholder="Password" />
                    <div class="invalid-feedback mt-2">Password is required</div>
                </div>

                <div class="col-md-12">
                    <button type="submit" class="btn btn-primary mt-1 mb-4 p-2 w-100">
                        <span class="spinner spinner-border spinner-border-sm d-none" aria-hidden="true"></span>
                        <span class="button-text">Register Admin</span>
                    </button>
                </div>
            </div>
        </form>`
    }

    static AdminUpdate() {
        return `
            <div class="row g-3 mx-0">
                <div class="col-lg-6 form-group my-3">
                    <input type="text" class="form-control py-3" name="firstname" placeholder="Firstname" />
                    <div class="invalid-feedback mt-2">Firstname is required</div>
                </div>
                <div class="col-lg-6 form-group my-3">
                    <input type="text" class="form-control py-3" name="lastname" placeholder="Lastname" />
                    <div class="invalid-feedback mt-2">Lastname is required</div>
                </div>
                <div class="col-lg-6 form-group my-3">
                    <select name="role" class="form-select py-3">
                        <option>Super Admin</option>
                        <option>System Admin</option>
                    </select>
                    <div class="invalid-feedback mt-2">Role is required</div>
                </div>
                <div class="col-lg-6 form-group my-3">
                    <input type="text" class="form-control py-3" name="phone-no" placeholder="Phone number" />
                    <div class="invalid-feedback mt-2">Phone number is required</div>
                </div>
                <div class="col-md-12 form-group my-3">
                    <input type="email" class="form-control py-3" name="email" placeholder="Email" />
                    <div class="invalid-feedback mt-2">Email is required</div>
                </div>
                <div class="col-md-12">
                    <button type="submit" class="btn btn-primary mt-1 mb-4 p-2 w-100">
                        <span class="spinner spinner-border spinner-border-sm d-none" aria-hidden="true"></span>
                        <span class="button-text">Update Admin</span>
                    </button>
                </div>
            </div>
    `
    }

    static AdminDelete() {
        return `
        <div class="row mx-0">
            <div class="col-12 mt-3 mb-2">
                <label for="delete" class="mb-3">Type <strong>DELETE</strong> to proceed</label>
                <input type="text" class="form-control py-3" id="deleteInput" placeholder="Type Delete" />
                <div class="invalid-feedback mt-2">Email is required</div>
            </div>

            <div class="col-12 p-2">
                <div class="row">
                    <div class="col-6">
                        <button id="deleteItem" class="btn btn-danger mt-1 mb-4 p-2 w-100">
                            <span class="button-text">Delete</span>
                        </button>
                    </div>
                    <div class="col-6">
                        <button id="cancelDelete" class="btn btn-outline-secondary mt-1 mb-4 p-2 w-100">
                            <span class="button-text">Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}

export default Forms;