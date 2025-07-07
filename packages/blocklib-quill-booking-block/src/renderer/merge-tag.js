const MergeTag = ({ val }) => {
    if (!val) return null;

    // Handle array format (booking data)
    if (typeof val === 'object' && val.bookingId) {
        const bookingInfo = `Booking ID: ${val.bookingId}`;
        if (val.bookingDate && val.bookingTime) {
            return `${bookingInfo} - ${val.bookingDate} ${val.bookingTime}`;
        }
        return bookingInfo;
    }

    // Handle string format
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            if (parsed.bookingId) {
                const bookingInfo = `Booking ID: ${parsed.bookingId}`;
                if (parsed.bookingDate && parsed.bookingTime) {
                    return `${bookingInfo} - ${parsed.bookingDate} ${parsed.bookingTime}`;
                }
                return bookingInfo;
            }
        } catch (e) {
            // If not JSON, return as is
            return val;
        }
    }

    return val ? String(val) : null;
};

export default MergeTag; 