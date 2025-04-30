import Utils from "./utils.js";

function toggleSidebar(selector) {
    const triggers = document.querySelectorAll(selector);
    triggers.forEach(trigger => {
        trigger.onclick = (e) => {
            Utils.classListActions('toggle', ['show'], '#sidebar')
            Utils.classListActions('toggle', ['show'], '.sidebar-backdrop')
            return;
        }
    })
}

toggleSidebar('.sidebarController')
