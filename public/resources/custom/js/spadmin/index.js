import Utils from '../globals/utils.js';
import { RenderAdminProfile } from './renders.js';
import { viewAdminsTable } from '../globals/datautils.js';

document.addEventListener('DOMContentLoaded', async () => {

    /**
     * Admins profile
     */

    await Utils.getData({
        endpoint: Utils.getEndpoint('view-admin'),
        beforeSend: RenderAdminProfile.beforeSend,
        success: RenderAdminProfile.success,
        fail: RenderAdminProfile.fail,
        handler: RenderAdminProfile.display,
    })

    /**
     * Admins Table
     */
    const limit = 8

    await viewAdminsTable(limit)

    setTableLimit(limit);

    setTableTotals(1, limit, await getCount())

    /**
     * Format table on Limit Change
     */
    formatTableOnLimitChange("adminsTable");

    Utils.logout('logoutController');

    prepareTableControls();


})



async function formatTableOnLimitChange(table) {
    const tableLimit = document.getElementById("tableLimit");
    const tbody = document.getElementById(table);
    tableLimit.onchange = async (e) => {
        e.preventDefault();
        tbody.innerHTML = null;
        await viewAdminsTable(tableLimit.value)
        await prepareTableControls();
        setTableTotals(1, tableLimit.value, await getCount())
    }
}


function setTableTotals(first, last, all) {
    const firstTableRow = document.getElementById("firstTableRow");
    const lastTableRow = document.getElementById("lastTableRow");
    const totalRows = document.getElementById("totalRows");
    firstTableRow.immerHTML = first;
    lastTableRow.innerHTML = last;
    totalRows.innerHTML = all;
    return;
}


function setTableLimit(limit) {
    const tableLimit = document.getElementById("tableLimit");
    tableLimit.value = limit
}




async function fetchCount(url) {
    try {
        const res = await fetch(Utils.getUrl(url));
        if (res.ok) {
            const count = await res.json();
            return count;
        }
    } catch (err) {
        console.error(err);
        Utils.getError('Something unexpected happened', err)
    }

}


async function getCount() {
    return await fetchCount('/admins/count');
}


async function prepareTableControls() {
    const count = await getCount()
    const limit = document.getElementById("tableLimit").value;
    getTableControls(count, limit);
}


function getTableControls(totalRows = 50, rowsPerPage = 10) {
    const backArrow = document.getElementById("backArrow");
    const backSkipArrow = document.getElementById("backSkipArrow");
    const currentPage = document.getElementById("currentPage");
    const forwardArrow = document.getElementById("forwardArrow");
    const forwardSkipArrow = document.getElementById("forwardSkipArrow");

    const totalPages = Math.ceil(totalRows / rowsPerPage);
    let currentPageContent = Number(currentPage.value);

    const triggerChange = (direction) => {
        const changeEvent = new CustomEvent('change', {
            detail: { direction }
        });
        currentPage.dispatchEvent(changeEvent);
    };

    const updatePage = (newPage, direction) => {
        currentPageContent = Math.min(Math.max(newPage, 1), totalPages); // Clamp between 1 and totalPages
        currentPage.value = currentPageContent;
        triggerChange(direction);
    };

    backArrow.onclick = () => updatePage(currentPageContent - 1, "back");
    forwardArrow.onclick = () => updatePage(currentPageContent + 1, "forward");
    backSkipArrow.onclick = () => updatePage(currentPageContent - 5, "backSkip");
    forwardSkipArrow.onclick = () => updatePage(currentPageContent + 5, "forwardSkip");

    currentPage.onchange = (e) => {
        const direction = e.detail?.direction || "manual";
        currentPageContent = Math.min(Math.max(Number(currentPage.value), 1), totalPages);
        currentPage.value = currentPageContent;
    };
}























