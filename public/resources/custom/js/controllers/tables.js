import Utils from "../global/utils.js";
import TableComponents from "../components/table.js";
/**
 * @author DPZTechnologies
 * @date 
 */
class TableController extends TableComponents {

    static instance;

    constructor(tableCallback) {
        super();
        this.tableCallback = null ?? tableCallback
    }


    static setLimit(limit) {
        const tableLimit = document.getElementById("tableLimit");
        tableLimit.value = limit
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setFallbackUrl(fallbackUrl) {
        this.fallbackUrl = fallbackUrl
        return this;
    }

    static setName(name) {
        const tableName = document.getElementById("tableName");
        tableName.innerHTML = name;
    }

    setCount(count) {
        this.count = count;
        return this;
    }


    async formatTableOnLimitChange() {
        const tableLimit = document.getElementById("tableLimit");
        tableLimit.onchange = async (e) => {
            e.preventDefault();
            const limit = parseInt(tableLimit.value);
            const currentPage = 1;
            const fullURL = this.url + `?limit=${limit}`
            await this.tableCallback(fullURL);
            this.getControls(this.tableCallback, fullURL);
            this.setTotals(currentPage, limit);
            this.getRowCount(currentPage, limit);
        };
    }


    static async getCount(url) {
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



    getRowCount(currentPage, limit) {
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
        this.setCounters(startIndex, endIndex, this.count)
    }

    setCounters(start, end, totalRows) {
        const startCounterId = document.getElementById("firstTableRow")
        const endCounterId = document.getElementById("lastTableRow")
        const totalRowsId = document.getElementById("totalRows")
        startCounterId.innerHTML = parseInt(start) + 1;
        endCounterId.innerHTML = end
        totalRowsId.innerHTML = totalRows
        return;
    }

    getControls() {
        const tbody = document.querySelector('tbody')
        const limit = document.getElementById("tableLimit").value;
        this.setControls(this.count, limit, tbody);
        return;
    }

    setControls(totalRows = 50, rowsPerPage = 10, tbody) {
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
            await this.animateTableReload(tbody, async () => {
                await this.modifyTableOnControlsChange(currentPage.value, limitValue);
            });
            this.getRowCount(currentPage.value, limitValue);
            return;
        };
    }

    async animateTableReload(tbody, updateCallback) {
        tbody.style.opacity = 0;
        await new Promise(resolve => setTimeout(resolve, 300));
        await updateCallback();
        tbody.style.opacity = 1;
    }

    async modifyTableOnControlsChange(currentPage, limit) {
        const params = `?currentPage=${currentPage}&limit=${limit}`
        await this.tableCallback(this.url + params);
        return
    }


    setTotals(first, last) {
        const firstTableRow = document.getElementById("firstTableRow");
        const lastTableRow = document.getElementById("lastTableRow");
        const totalRows = document.getElementById("totalRows");
        firstTableRow.innerHTML = first;
        lastTableRow.innerHTML = last;
        totalRows.innerHTML = this.count;
        return;
    }

    search() {
        const searchBox = document.getElementById('tableSearch');
        let debounceTimer;
        searchBox.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                const query = searchBox.value.trim();
                if (query.length > 1) {
                    this.#modifyTableOnSearch(query);
                } else {
                    await this.tableCallback(this.fallbackUrl)
                }
            }, 400);
        });

    }

    async #modifyTableOnSearch(keyword) {
        const params = `?keyword=${keyword}`;
        await this.tableCallback(this.url + params);
        return
    }

    static call(tableCallback) {
        return new this(tableCallback)
    }



    async deleteRow(callback) {
        const table = document.querySelector('table');
        table.addEventListener('click', async (e) => {
            const btn = e.target.closest('.delete');
            if (!btn) return;
            e.preventDefault();
            const confirmed = await callback();
            if (confirmed) {
                const id = TableController.getIdFromTrow(btn);
                const params = `?id=${id}`;
                this.tableCallback(this.url + params);
                Utils.displayToastMessage('.toast', 'Record deleted successfully', 'bg-info');
                Utils.reload(6000);
            }
        });
        return this;
    }


    editRow() {
        const table = document.querySelector('table');
        table.addEventListener('click', (e) => {
            const btn = e.target.closest('.edit');
            if (!btn) return;
            e.preventDefault();
            const id = TableController.getIdFromTrow(btn);
            const params = `?id=${id}`;
            fetch(this.url + params).then((res) => {
                res.json().then(data => {
                    this.tableCallback(data);
                })
            })
        })
        return
    }


    grantAccess() {
        const adminCanAccess = document.querySelectorAll('.adminCanAccess');
        adminCanAccess.forEach(accessCheck => {
            accessCheck.addEventListener('change', (e) => {
                const id = TableController.getIdFromTrow(accessCheck);
                const params = `?id=${id}`;
                fetch(this.url + params).then(res => {
                    res.json().then(data => {
                        this.tableCallback(data);
                    })
                })
            })
        })
        return;
    }



    static getIdFromTrow(elem) {
        let parentElem = TableController.getParentElem(elem, 'tr');
        return parentElem.getAttribute('data-id');
    }

    static getParentElem(elem, target) {
        return elem.closest(target)
    }
}


export { TableController }
