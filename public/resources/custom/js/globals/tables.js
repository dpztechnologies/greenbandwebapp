class Tables {


    static handleEmptyRows(target, data) {
        // Check if data is empty
        if (data.length === 0) {
            // Find the number of columns in the table (this assumes the table header defines the number of columns)
            const columnCount = document.querySelector('table thead tr').children.length;
            // Render empty state with bin icon and message inside a single <td> spanning all columns
            target.innerHTML = `
            <tr>
                <td colspan="${columnCount}" class="text-center" style="height: 200px;">
                    <div class="d-flex justify-content-center align-items-center" style="height: 100%;">
                        <div class="text-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 2H6C4.89543 2 4 2.89543 4 4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V8L14 2H10Z" stroke="#6c757d" stroke-width="1.5"/>
                                <path d="M14 2V8H20" stroke="#6c757d" stroke-width="1.5"/>
                                <circle cx="11" cy="13" r="3" stroke="#6c757d" stroke-width="1.5"/>
                                <line x1="13.5" y1="15.5" x2="16" y2="18" stroke="#6c757d" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <p class="mt-2">No results found</p>
                        </div>
                    </div>
                </td>
            </tr>
        `;
            return true;
        }
        return false
    }
}


export default Tables
