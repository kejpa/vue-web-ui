import { getAccessToken, setAccessToken, clearAccessToken } from '../stores/tokenStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- intern refresh‑kö ---
let isRefreshing = false;
let refreshQueue = [];

function enqueueRetry(resolve, reject, retryFn) {
    refreshQueue.push({ resolve, reject, retryFn });
}

function flushQueue(error = null) {
    refreshQueue.forEach(({ resolve, reject, retryFn }) => {
        if (error) reject(error);
        else resolve(retryFn());
    });
    refreshQueue = [];
}

// --- helpers ---
function buildHeaders(extra = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...extra
    };

    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    return headers;
}

async function handleResponse(response) {
    // Läs nytt access‑token från header (om finns)
    const newToken = response.headers.get('X-Access-Token');
    if (newToken) setAccessToken(newToken);

    // Tom body?
    if (response.status === 204) return null;

    const data = await response.json();
    return data;
}

async function refreshAccessToken() {
    const res = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        credentials: 'include' // httpOnly‑cookie
    });

    if (!res.ok) {
        clearAccessToken();
        throw await res.json();
    }

    // Uppdatera token från response‑header
    const newToken = res.headers.get('X-Access-Token');
    if (newToken) setAccessToken(newToken);
}

// --- core request ---
async function request(method, path, body = null) {
    // Offline / network check (minimal PWA‑medvetenhet)
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        throw { type: 'NetworkError', message: 'Offline' };
    }

    const options = {
        method,
        headers: buildHeaders(),
        credentials: 'include'
    };

    if (body !== null) options.body = JSON.stringify(body);

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, options);
    } catch {
        throw { type: 'NetworkError', message: 'Network request failed' };
    }

    // --- 401 specialfall: refresh + kö ---
    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                await refreshAccessToken();
                isRefreshing = false;
                flushQueue();
            } catch (err) {
                isRefreshing = false;
                flushQueue(err);
                throw err;
            }
        }

        return new Promise((resolve, reject) => {
            enqueueRetry(resolve, reject, () => request(method, path, body));
        });
    }

    // --- andra 4xx/5xx: kasta backend‑payload ---
    if (!response.ok) {
        const payload = await response.json();
        throw payload;
    }

    return handleResponse(response);
}

// --- Publikt API ---
export const api = {
    get: (path) => request('GET', path),
    post: (path, data) => request('POST', path, data),
    put: (path, data) => request('PUT', path, data),
    delete: (path) => request('DELETE', path)
};
``