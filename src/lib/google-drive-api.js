/**
 * Google Drive API Integration
 *
 * This module handles Google Drive authentication and file picking using:
 * - Google Identity Services for OAuth 2.0 authentication
 * - Google Picker API for file selection UI
 */

import {loadAllGoogleScripts} from './google-script-loader';

// OAuth 2.0 scopes
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// Discovery docs for Google Drive API
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Google API configuration (loaded from environment variables)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const API_KEY = process.env.GOOGLE_API_KEY;

/**
 * GoogleDriveAPI class
 * Manages authentication and file operations with Google Drive
 */
class GoogleDriveAPI {
    constructor () {
        this.isInitialized = false;
        this.tokenClient = null;
        this.accessToken = null;
        this.pickerCallback = null;
    }

    /**
     * Initialize Google API and Identity Services
     * @returns {Promise<void>} Promise that resolves when initialization is complete
     */
    async initialize () {
        if (this.isInitialized) {
            return;
        }

        // Validate configuration
        if (!CLIENT_ID || !API_KEY) {
            throw new Error(
                'Google Drive API credentials not configured. ' +
                'Please set GOOGLE_CLIENT_ID and GOOGLE_API_KEY environment variables. ' +
                'See docs/google-drive-setup.md for setup instructions.'
            );
        }

        try {
            // Load Google scripts dynamically
            await loadAllGoogleScripts();

            // Initialize gapi client
            await new Promise((resolve, reject) => {
                window.gapi.load('client:picker', {
                    callback: resolve,
                    onerror: reject
                });
            });

            // Initialize gapi client with API key and discovery docs
            await window.gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: DISCOVERY_DOCS
            });

            // Initialize Google Identity Services token client
            this.tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '' // Will be set dynamically when requesting access
            });

            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize Google Drive API:', error);
            throw new Error('Google Drive API initialization failed. Please check your configuration.');
        }
    }

    /**
     * Request access token
     * @returns {Promise<string>} Promise that resolves with access token
     */
    requestAccessToken () {
        return new Promise((resolve, reject) => {
            this.tokenClient.callback = response => {
                if (response.error) {
                    reject(new Error(`Authentication failed: ${response.error}`));
                    return;
                }
                this.accessToken = response.access_token;
                resolve(response.access_token);
            };

            // Check if user already has valid token
            if (this.accessToken && window.gapi.client.getToken()) {
                resolve(this.accessToken);
                return;
            }

            // Request new token
            this.tokenClient.requestAccessToken({prompt: ''});
        });
    }

    /**
     * Show Google Picker to select a file
     * @param {Function} callback - Called when user selects a file
     * @returns {Promise<void>} Promise that resolves when picker is shown
     */
    async showPicker (callback) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            // Request access token if not already available
            const token = await this.requestAccessToken();

            this.pickerCallback = callback;

            // Create and show picker
            const picker = new window.google.picker.PickerBuilder()
                .addView(
                    new window.google.picker.DocsView()
                        .setIncludeFolders(true)
                        .setMimeTypes('application/x.scratch.sb3')
                )
                .addView(
                    new window.google.picker.DocsUploadView()
                        .setIncludeFolders(true)
                )
                .setOAuthToken(token)
                .setDeveloperKey(API_KEY)
                .setCallback(this.handlePickerResponse.bind(this))
                .setTitle('Select a Scratch 3.0 project (.sb3) from Google Drive')
                .build();

            picker.setVisible(true);
        } catch (error) {
            console.error('Failed to show Google Picker:', error);
            throw error;
        }
    }

    /**
     * Handle picker response
     * @param {object} data - Picker response data
     */
    handlePickerResponse (data) {
        const action = data[window.google.picker.Response.ACTION];

        if (action === window.google.picker.Action.PICKED) {
            const doc = data[window.google.picker.Response.DOCUMENTS][0];
            const fileId = doc[window.google.picker.Document.ID];
            const fileName = doc[window.google.picker.Document.NAME];
            const mimeType = doc[window.google.picker.Document.MIME_TYPE];

            // Validate file type
            if (mimeType !== 'application/x.scratch.sb3' && !fileName.endsWith('.sb3')) {
                if (this.pickerCallback) {
                    this.pickerCallback({
                        error: 'Invalid file type. Please select a .sb3 file.'
                    });
                }
                return;
            }

            // Download file
            this.downloadFile(fileId, fileName)
                .then(fileData => {
                    if (this.pickerCallback) {
                        this.pickerCallback({
                            success: true,
                            fileId: fileId,
                            fileName: fileName,
                            fileData: fileData
                        });
                    }
                })
                .catch(error => {
                    if (this.pickerCallback) {
                        this.pickerCallback({
                            error: `Failed to download file: ${error.message}`
                        });
                    }
                });
        } else if (action === window.google.picker.Action.CANCEL) {
            if (this.pickerCallback) {
                this.pickerCallback({
                    cancelled: true
                });
            }
        }
    }

    /**
     * Download file from Google Drive
     * @param {string} fileId - Google Drive file ID
     * @param {string} fileName - File name (for debugging)
     * @returns {Promise<ArrayBuffer>} Promise that resolves with file data as ArrayBuffer
     */
    async downloadFile (fileId, fileName) {
        try {
            const response = await window.gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });

            // Convert response to ArrayBuffer
            // gapi returns the file content as a string for binary files
            const binaryString = response.body;
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (error) {
            console.error(`Failed to download file ${fileName}:`, error);
            throw new Error(`Failed to download file: ${error.message}`);
        }
    }

    /**
     * Check if API is configured
     * @returns {boolean} True if API credentials are configured
     */
    static isConfigured () {
        return !!(CLIENT_ID && API_KEY);
    }
}

// Export singleton instance
export default new GoogleDriveAPI();
