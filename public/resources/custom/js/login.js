import Utils from "./utils.js";

const root = document.getElementById('root');

root.setAttribute('class', 'd-flex justify-content-center')

const tableContainer = document.createElement('div');

tableContainer.setAttribute('class', 'col-md-9');

const table = document.createElement('table');

table.setAttribute('class', 'table')

const tableHead = document.createElement('thead');

const tableHeadingRow = document.createElement('tr')

const tableBody = document.createElement('tbody');


async function getUserData() {
    try {
        const response = await fetch(Utils.getUrl('/users'))

        if (!response.ok) {
            throw new Error('Invalid response');
        }

        const data = await response.json();

        return data
    } catch (err) {
        throw err;
    }
}

getUserData().then((res) => {
    res.forEach((data, index) => {
        let tr = document.createElement('tr');
        for (let x in data) {
            if (index === 0) {
                let th = document.createElement('th');
                th.append(x)
                tableHeadingRow.appendChild(th)
                tableHead.appendChild(tableHeadingRow);
                table.appendChild(tableHead);
            }
            let td = document.createElement('td');
            td.append(data[x]);
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    })
    table.appendChild(tableHead);
    table.appendChild(tableBody)
    tableContainer.appendChild(table);
    root.appendChild(tableContainer);
});