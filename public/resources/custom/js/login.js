import Utils from "./utils.js";


const form = document.getElementById("loginForm");

form.onsubmit = (e) => {
    e.preventDefault();
    const options = {
        method: 'POST',
        body: new FormData(form)
    }
    postData(options)
}

async function postData(options) {
    try {
        const endpoint = Utils.getUrl("/login");
        const response = await fetch(endpoint, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            let error = JSON.parse(await response.text())
            let errorInput = document.querySelector(`input[name="${error.handler}"]`);
            errorInput.classList.add("is-invalid");
            let errorHandler = errorInput.nextElementSibling;
            errorHandler.innerHTML = error.message;
        }
    } catch (err) {
        console.error(err.message);
    }
}