import Utils from '../globals/utils.js';
import { RenderAdminProfile } from './renders.js';
import { getAdminsTable } from '../globals/datautils.js';


const endPoints = {
    'view-admins': Utils.getEndpoint('view-admins'),
    'admins-paginate': Utils.getEndpoint('admin-paginate'),
    'search-admin': Utils.getEndpoint('search-admin')
}

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
    /**
     * 
     */
    await getAdminsTable(`${endPoints['view-admins']}?limit=${limit}`)
    /**
     * 
     */
    setTableLimit(limit);
    /**
     * 
     */
    setTableTotals(1, limit, await getCount())
    /**
     * Format table on Limit Change
     */
    formatTableOnLimitChange();

    Utils.logout('logoutController');

    prepareTableControls();

    searchTable();

})



async function formatTableOnLimitChange() {
    const tableLimit = document.getElementById("tableLimit");
    const tbody = document.querySelector('tbody');
    tableLimit.onchange = async (e) => {
        e.preventDefault();
        const limit = parseInt(tableLimit.value);
        const currentPage = 1;
        await getAdminsTable(`${endPoints['view-admins']}/${limit}`);
        await prepareTableControls(tbody);
        setTableTotals(currentPage, limit, await getCount());
        getRowCount(currentPage, limit);
    };
}


async function animateTableReload(tbody, updateCallback) {
    tbody.style.opacity = 0;
    await new Promise(resolve => setTimeout(resolve, 300));
    await updateCallback();
    tbody.style.opacity = 1;
}




function setTableTotals(first, last, all) {
    const firstTableRow = document.getElementById("firstTableRow");
    const lastTableRow = document.getElementById("lastTableRow");
    const totalRows = document.getElementById("totalRows");
    firstTableRow.innerHTML = first;
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


function getRowCount(currentPage, limit) {
    const counted = document.querySelectorAll('.count');
    const startIndex = (currentPage - 1) * limit;
    counted.forEach((count, index) => {
        count.innerHTML = startIndex + index + 1;
    });
}



function searchTable() {
    const searchBox = document.getElementById('tableSearch');
    let debounceTimer;
    searchBox.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const query = searchBox.value.trim();
            if (query.length > 1) {
                modifyTableOnSearch(query);
            } else {
                await getAdminsTable(`${endPoints['view-admins']}?limit=8`)
            }
        }, 400);
    });

}




async function getCount() {
    return await fetchCount('/admins/count');
}


async function prepareTableControls() {
    const count = await getCount()
    const tbody = document.querySelector('tbody')
    const limit = document.getElementById("tableLimit").value;
    getTableControls(count, limit, tbody);
}


function getTableControls(totalRows = 50, rowsPerPage = 10, tbody) {
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

    currentPage.onchange = async (e) => {
        currentPageContent = Math.min(Math.max(Number(currentPage.value), 1), totalPages);
        currentPage.value = currentPageContent;
        const limit = document.getElementById("tableLimit");
        const limitValue = parseInt(limit.value);
        await animateTableReload(tbody, async () => {
            await modifyTableOnControlsChange(currentPage.value, limitValue);
        });
        getRowCount(currentPage.value, limitValue);
        return;
    };
}


async function modifyTableOnControlsChange(currentPage, limit) {
    await getAdminsTable(`${endPoints['admins-paginate']}?currentPage=${currentPage}&limit=${limit}`)
    return
}

async function modifyTableOnSearch(keyword) {
    await getAdminsTable(`${endPoints['search-admin']}?keyword=${keyword}`)
    return
}






















