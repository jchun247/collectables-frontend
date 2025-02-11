/**
 * Formats a string to be more human readable by:
 * - Capitalizing the first letter of each word
 * - Converting hyphens and underscores to spaces
 * @param {string} text - The text to format
 * @returns {string} The formatted text
 */
export const formatCardText = (text) => {
    if (!text) return '';
    return text
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};