import Utils from "./utils.js";

function toggleSidebar(selector) {
    const triggers = document.querySelectorAll(selector);
    triggers.forEach(trigger => {
        trigger.onclick = (e) => {
            console.log('true')
            return Utils.classListActions('toggle', ['d-none'], '#sidebar')
        }
    })
}

toggleSidebar('.sidebarController')
