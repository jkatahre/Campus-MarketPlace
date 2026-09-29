import React, { createContext, useContext, useEffect, useState } from "react";

// Accounts are stored in this browser's localStorage (the app has no backend yet).
// Passwords are salted and hashed with SHA-256 so they are never stored as plain text.
const USERS_KEY = "users";
const SESSION_KEY = "currentUserId";

const AuthContext = createContext(null);

function loadUsers() {
    try {
        const saved = localStorage.getItem(USERS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Error parsing saved users:", error);
        return [];
    }
}

async function hashPassword(password, salt) {
    const bytes = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Never expose password fields to components.
function toPublicUser(user) {
    if (!user) return null;
    const { passwordHash, salt, ...publicUser } = user;
    return publicUser;
}

export function AuthProvider({ children }) {
    const [users, setUsers] = useState(loadUsers);
    const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem(SESSION_KEY));

    useEffect(() => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (currentUserId) {
            localStorage.setItem(SESSION_KEY, currentUserId);
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    }, [currentUserId]);

    const currentUser = toPublicUser(users.find((user) => user.id === currentUserId));

    const signup = async ({ password, ...details }) => {
        const email = details.email.trim().toLowerCase();
        const enrollmentNumber = details.enrollmentNumber.trim().toUpperCase();

        if (users.some((user) => user.email === email)) {
            throw new Error("An account with this email already exists.");
        }
        if (users.some((user) => user.enrollmentNumber === enrollmentNumber)) {
            throw new Error("An account with this enrollment number already exists.");
        }

        const salt = crypto.randomUUID();
        const newUser = {
            ...details,
            id: crypto.randomUUID(),
            name: details.name.trim(),
            email,
            enrollmentNumber,
            salt,
            passwordHash: await hashPassword(password, salt),
            createdAt: new Date().toISOString(),
        };

        setUsers((prev) => [...prev, newUser]);
        setCurrentUserId(newUser.id);
        return toPublicUser(newUser);
    };

    // Students can log in with either their email or enrollment number.
    const login = async (identifier, password) => {
        const id = identifier.trim();
        const user = users.find(
            (u) => u.email === id.toLowerCase() || u.enrollmentNumber === id.toUpperCase()
        );

        if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
            throw new Error("Incorrect email/enrollment number or password.");
        }

        setCurrentUserId(user.id);
        return toPublicUser(user);
    };

    const logout = () => setCurrentUserId(null);

    return (
        <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider.");
    }
    return context;
}
