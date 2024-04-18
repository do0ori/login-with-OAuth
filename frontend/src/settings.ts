declare global {
    interface Window {
        _ENV?: {
            REACT_APP_BASE_URL?: string;
        };
    }
}

const { REACT_APP_BASE_URL: API_BASE_URL = "" } = window._ENV ?? process.env;
const { REACT_APP_REST_API_KEY: REST_API_KEY, REACT_APP_REDIRECT_URI: REDIRECT_URI } = process.env;

export { API_BASE_URL, REST_API_KEY, REDIRECT_URI };