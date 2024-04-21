declare global {
    interface Window {
        _ENV?: {
            REACT_APP_BASE_URL?: string;
        };
    }
}

const { REACT_APP_BASE_URL: API_BASE_URL = "" } = window._ENV ?? process.env;

export { API_BASE_URL };