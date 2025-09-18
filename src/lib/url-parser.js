/**
 * Utility functions for parsing project URLs
 */

/**
 * Extract Scratch project ID from Scratch project URL
 * @param {string} url - Scratch project URL
 * @returns {string|null} - Project ID or null if invalid
 */
export const extractScratchProjectId = url => {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const patterns = [
        // Standard project URL: https://scratch.mit.edu/projects/1209008277/
        /^https?:\/\/scratch\.mit\.edu\/projects\/(\d+)\/?$/,
        // Project URL with additional path: https://scratch.mit.edu/projects/1209008277/editor/
        /^https?:\/\/scratch\.mit\.edu\/projects\/(\d+)\/.*$/
    ];

    for (const pattern of patterns) {
        const match = url.trim().match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};

/**
 * Validate if URL is a valid Scratch project URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid Scratch project URL
 */
export const isValidScratchProjectUrl = url => extractScratchProjectId(url) !== null;

/**
 * Extract Google Drive file ID from Google Drive URL
 * @param {string} url - Google Drive URL
 * @returns {string|null} - File ID or null if invalid
 */
export const extractGoogleDriveFileId = url => {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const patterns = [
        // Pattern 1: https://drive.google.com/file/d/FILE_ID/view
        /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
        // Pattern 2: https://drive.google.com/open?id=FILE_ID
        /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
        // Pattern 3: https://drive.google.com/uc?export=download&id=FILE_ID (or similar)
        /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
        const match = url.trim().match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};

/**
 * Validate if URL is a valid Google Drive URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid Google Drive URL
 */
export const isValidGoogleDriveUrl = url => extractGoogleDriveFileId(url) !== null;

/**
 * Determine URL type (scratch or google-drive)
 * @param {string} url - URL to check
 * @returns {string|null} - 'scratch', 'google-drive', or null if invalid
 */
export const getUrlType = url => {
    if (isValidScratchProjectUrl(url)) {
        return 'scratch';
    }
    if (isValidGoogleDriveUrl(url)) {
        return 'google-drive';
    }
    return null;
};
