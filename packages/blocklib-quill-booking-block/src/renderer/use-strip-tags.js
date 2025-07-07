/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';

const useStripTags = (html) => {
    return useMemo(() => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    }, [html]);
};

export default useStripTags; 