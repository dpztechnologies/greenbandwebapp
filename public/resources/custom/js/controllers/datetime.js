class DateTime {
    static format(timestamp, format) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const allowedDateFormats = ['d/m/Y', 'd', 'm', 'Y', 'g:iA', 'd/m/Y g:iA'];

        if (allowedDateFormats.includes(format)) {
            switch (format) {
                case 'd/m/Y':
                    return `${day} /${month}/${year}`
                case 'd':
                    return `${day}`
                case 'm':
                    return `${month}`
                case 'Y':
                    return `${year}`
                case 'g:iA':
                    return `${hours}:${minutes}${ampm}`
                case 'd/m/Y g:iA':
                    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
                default:
                    return `${day} /${month}/${year}`
            }
        }
        throw new Error(`Invalid Date time format ${format}`);
    }

    static get(format) {
        return DateTime.format(new Date(), format);
    }

}

export default DateTime;