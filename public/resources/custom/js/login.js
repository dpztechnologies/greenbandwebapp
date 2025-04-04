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
            let errorText = await response.text()
            throw new Error("Network Error: " + errorText)
        }
    } catch (err) {
        console.err(err.message);
    }
}