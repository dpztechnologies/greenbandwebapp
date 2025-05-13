import Utils from '../globals/utils.js';
import { RenderAdminProfile } from './renders.js';
import { getAdminsTable } from '../globals/datautils.js';


const endPoints = {
    'view-admins': Utils.getEndpoint('view-admins'),
    'admins-paginate': Utils.getEndpoint('admin-paginate'),
    'search-admin': Utils.getEndpoint('search-admin'),
    'admins-count': '/admins/count'
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
     * 
     */
    setTableName('admins')
    /**
    * 
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
    setTableTotals(1, limit, await getCount(endPoints['admins-count']))
    /**
     * Format table on Limit Change
     */
    formatTableOnLimitChange(getAdminsTable, `${endPoints['view-admins']}`, endPoints['admins-count']);
    /**
     * 
     */
    Utils.logout('logoutController');
    /**
     * 
     */
    setTableControls(getAdminsTable, endPoints['admins-paginate'], endPoints['admins-count']);
    /**
     * 
     */
    searchTable(getAdminsTable, `${endPoints['search-admin']}`, `${endPoints['view-admins']}?limit=8`);
})



async function formatTableOnLimitChange(tableCallback, url, countUrl) {
    const tableLimit = document.getElementById("tableLimit");
    tableLimit.onchange = async (e) => {
        e.preventDefault();
        const limit = parseInt(tableLimit.value);
        const currentPage = 1;
        const fullURL = url + `?limit=${limit}`
        await tableCallback(fullURL);
        await prepareTableControls(tableCallback, fullURL);
        setTableTotals(currentPage, limit, await getCount(countUrl));
        await getRowCount(currentPage, limit, countUrl);
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

function setTableName(name) {
    const tableName = document.getElementById("tableName");
    tableName.innerHTML = name;
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


async function getRowCount(currentPage, limit, countUrl) {
    const counted = document.querySelectorAll('.count');
    const startIndex = (currentPage - 1) * limit;
    let counts = [];
    counted.forEach((count, index) => {
        let endIndex = startIndex + index + 1;
        count.innerHTML = endIndex;
        counts = [];
        counts.push(endIndex);
    });
    const endIndex = counts[counts.length - 1];
    setTableCounters(startIndex, endIndex, await getCount(countUrl))
}


function setTableCounters(start, end, totalRows) {
    const startCounterId = document.getElementById("firstTableRow")
    const endCounterId = document.getElementById("lastTableRow")
    const totalRowsId = document.getElementById("totalRows")
    startCounterId.innerHTML = parseInt(start) + 1;
    endCounterId.innerHTML = end
    totalRowsId.innerHTML = totalRows
}



function searchTable(tableCallback, searchUrl, fallbackUrl) {
    const searchBox = document.getElementById('tableSearch');
    let debounceTimer;
    searchBox.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const query = searchBox.value.trim();
            if (query.length > 1) {
                modifyTableOnSearch(tableCallback, searchUrl, query);
            } else {
                await tableCallback(fallbackUrl)
            }
        }, 400);
    });

}

async function getCount(url) {
    return await fetchCount(url);
}


async function setTableControls(tableCallback, url, countUrl) {
    const count = await getCount(countUrl)
    const tbody = document.querySelector('tbody')
    const limit = document.getElementById("tableLimit").value;
    getTableControls(count, limit, tbody, tableCallback, url, countUrl);
}


function getTableControls(totalRows = 50, rowsPerPage = 10, tbody, tableCallback, url, countUrl) {
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
            await modifyTableOnControlsChange(tableCallback, url, currentPage.value, limitValue);
        });
        await getRowCount(currentPage.value, limitValue, countUrl);
        return;
    };
}


async function modifyTableOnControlsChange(tableCallback, url, currentPage, limit) {
    const params = `?currentPage=${currentPage}&limit=${limit}`
    await tableCallback(url + params);
    return
}

async function modifyTableOnSearch(tableCallback, url, keyword) {
    const params = `?keyword=${keyword}`;
    await tableCallback(url + params);
    return
}






















