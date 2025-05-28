import Utils from "../global/utils.js";

class LogoutController {
    static async processLogout(redirectUrl) {
        try {
            let options = {
                'method': 'POST',
                'body': new FormData()
            }
            const res = await fetch('/logout', options);
            if (res.ok) {
                const data = await res.json();
                Utils.displayToastMessage('#alert-toast', data.message, 'bg-info', () => {
                    window.location.href = redirectUrl;
                })
            }
        } catch (err) {
            Utils.getError("Something unexpected happened", err);
        }

    }


    static logout(selector) {
        const logoutHandler = document.getElementById(selector)
        logoutHandler.onclick = async () => {
            await LogoutController.processLogout('/login');
        }
        return;
    }
}


export default LogoutController;

