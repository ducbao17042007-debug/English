// src/services/authService.ts
// Firebase Authentication (No circular imports - imports firebaseService only)

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    type User,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import {
    createUser,
    getUserByEmail,
    updateLastLogin,
    type ParentUser,
} from './firebaseService';

// ===== EMAIL/PASSWORD AUTH =====

export async function registerWithEmail(
    email: string,
    password: string,
    name: string
): Promise<{ success: boolean; message: string }> {
    try {
        // Create user in Firebase Auth
        await createUserWithEmailAndPassword(auth, email, password);

        // Create user document in Firestore
        const parentUser: ParentUser = {
            email,
            name,
        };
        await createUser(parentUser);

        return {
            success: true,
            message: `Đăng ký thành công! Chào mừng ${name}. 🎉`,
        };
    } catch (error: any) {
        const message =
            error.code === 'auth/email-already-in-use'
                ? 'Email này đã được sử dụng!'
                : error.message || 'Đã xảy ra lỗi đăng ký!';

        return { success: false, message };
    }
}

export async function loginWithEmail(
    email: string,
    password: string
): Promise<{ success: boolean; message: string; user?: ParentUser }> {
    try {
        // Sign in with Firebase Auth
        await signInWithEmailAndPassword(auth, email, password);

        // Get user info from Firestore
        const user = await getUserByEmail(email);
        if (!user) {
            return { success: false, message: 'Người dùng không tìm thấy!' };
        }

        // Update last login
        await updateLastLogin(email);

        return {
            success: true,
            message: `Đăng nhập thành công! Chào mừng ${user.name}. 🎉`,
            user,
        };
    } catch (error: any) {
        const message =
            error.code === 'auth/user-not-found'
                ? 'Email hoặc mật khẩu không chính xác!'
                : error.code === 'auth/wrong-password'
                    ? 'Email hoặc mật khẩu không chính xác!'
                    : error.message || 'Đã xảy ra lỗi đăng nhập!';

        return { success: false, message };
    }
}

// ===== GOOGLE AUTH =====

export async function loginWithGoogle(): Promise<{
    success: boolean;
    message: string;
    user?: ParentUser;
}> {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const email = result.user.email;
        const displayName = result.user.displayName;

        if (!email) {
            return {
                success: false,
                message: 'Email không tìm thấy từ Google!',
            };
        }

        // Check if user exists
        let user = await getUserByEmail(email);

        // If not exists, create new user
        if (!user) {
            user = {
                email,
                name: displayName || email.split('@')[0],
            };
            await createUser(user);
        }

        // Update last login
        await updateLastLogin(email);

        return {
            success: true,
            message: `Đăng nhập thành công! Chào mừng ${user.name}. 🎉`,
            user,
        };
    } catch (error: any) {
        const message =
            error.message || 'Đã xảy ra lỗi đăng nhập Google!';
        return { success: false, message };
    }
}

// ===== SESSION MANAGEMENT =====

export async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
    return auth.currentUser;
}

export function getCurrentEmail(): string | null {
    return auth.currentUser?.email || null;
}