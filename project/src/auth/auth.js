const USERS_KEY = 'users';
const AUTH_KEY = 'authUser';

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const buffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function getUsers() {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(username, password) {
    const users = getUsers();
    const exists = users.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
        return { success: false, error: 'Username already exists.' };
    }
    const passwordHash = await hashPassword(password);
    users.push({ username, passwordHash });
    saveUsers(users);
    return { success: true };
}

export async function loginUser(username, password) {
    const users = getUsers();
    const passwordHash = await hashPassword(password);
    const matched = users.find(
        (u) =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.passwordHash === passwordHash
    );
    if (!matched) {
        return { success: false, error: 'Invalid username or password.' };
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username: matched.username }));
    return { success: true, user: { username: matched.username } };
}

export function getAuthUser() {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function logoutUser() {
    localStorage.removeItem(AUTH_KEY);
}

export async function seedDemoUser() {
    const users = getUsers();
    const exists = users.some(
        (u) => u.username.toLowerCase() === 'demo'
    );
    if (!exists) {
        await registerUser('demo', 'demo1234');
    }
}
