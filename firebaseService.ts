// src/services/firebaseService.ts
// Firestore operations (No circular imports)

import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { type Mission } from '../data/missionsData';

// ===== TYPES =====

export interface ParentUser {
    email: string;
    name: string;
}

export interface ChildProfile {
    id: string;
    name: string;
    emoji: string;
    stars: number;
    level: number;
}

// ===== USERS =====

export async function getUserByEmail(email: string): Promise<ParentUser | null> {
    try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        return querySnapshot.docs[0].data() as ParentUser;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

export async function createUser(user: ParentUser): Promise<void> {
    try {
        const userDocId = user.email.replace(/[.@]/g, '_');
        await setDoc(doc(db, 'users', userDocId), {
            ...user,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

export async function updateLastLogin(email: string): Promise<void> {
    try {
        const userDocId = email.replace(/[.@]/g, '_');
        await updateDoc(doc(db, 'users', userDocId), {
            lastLogin: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating last login:', error);
    }
}

// ===== PROFILES =====

export async function getProfiles(userId: string): Promise<ChildProfile[]> {
    try {
        const q = query(collection(db, 'profiles'), where('parentId', '==', userId));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as ChildProfile[];
    } catch (error) {
        console.error('Error getting profiles:', error);
        return [];
    }
}

export async function createProfile(
    profile: Omit<ChildProfile, 'id'>,
    parentId: string
): Promise<string> {
    try {
        const profilesCollection = collection(db, 'profiles');
        const newDocRef = doc(profilesCollection);

        await setDoc(newDocRef, {
            ...profile,
            parentId,
            createdAt: new Date().toISOString(),
        });

        return newDocRef.id;
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
}

export async function updateProfile(
    profileId: string,
    updates: Partial<ChildProfile>
): Promise<void> {
    try {
        await updateDoc(doc(db, 'profiles', profileId), {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

export async function deleteProfile(profileId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'profiles', profileId));
    } catch (error) {
        console.error('Error deleting profile:', error);
    }
}

// Real-time listener for profiles
export function onProfilesChange(
    userId: string,
    callback: (profiles: ChildProfile[]) => void
): Unsubscribe {
    const q = query(collection(db, 'profiles'), where('parentId', '==', userId));

    return onSnapshot(q, (querySnapshot) => {
        const profiles = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as ChildProfile[];
        callback(profiles);
    });
}

// ===== MISSIONS =====

export async function getMissions(profileId: string): Promise<Mission[]> {
    try {
        const docSnap = await getDoc(doc(db, 'missions', profileId));

        if (docSnap.exists()) {
            return docSnap.data().missions || [];
        }

        return [];
    } catch (error) {
        console.error('Error getting missions:', error);
        return [];
    }
}

export async function saveMissions(
    profileId: string,
    missions: Mission[]
): Promise<void> {
    try {
        await setDoc(doc(db, 'missions', profileId), {
            missions,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error saving missions:', error);
    }
}

export async function updateMission(
    profileId: string,
    missionId: string,
    updates: Partial<Mission>
): Promise<void> {
    try {
        const docSnap = await getDoc(doc(db, 'missions', profileId));

        if (docSnap.exists()) {
            const missions = docSnap.data().missions || [];
            const updatedMissions = missions.map((m: Mission) =>
                m.id === missionId ? { ...m, ...updates } : m
            );

            await setDoc(doc(db, 'missions', profileId), {
                missions: updatedMissions,
                updatedAt: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error('Error updating mission:', error);
    }
}

// Real-time listener for missions
export function onMissionsChange(
    profileId: string,
    callback: (missions: Mission[]) => void
): Unsubscribe {
    return onSnapshot(doc(db, 'missions', profileId), (docSnap) => {
        if (docSnap.exists()) {
            const missions = docSnap.data().missions || [];
            callback(missions);
        } else {
            callback([]);
        }
    });
}

// ===== PROGRESS =====

export interface UserProgress {
    listeningCompleted: number;
    speakingCompleted: number;
    readingCompleted: number;
    writingCompleted: number;
    totalStars: number;
    updatedAt?: string;
}

export async function getProgress(profileId: string): Promise<UserProgress> {
    try {
        const docSnap = await getDoc(doc(db, 'progress', profileId));

        if (docSnap.exists()) {
            return docSnap.data() as UserProgress;
        }

        return {
            listeningCompleted: 0,
            speakingCompleted: 0,
            readingCompleted: 0,
            writingCompleted: 0,
            totalStars: 0,
        };
    } catch (error) {
        console.error('Error getting progress:', error);
        return {
            listeningCompleted: 0,
            speakingCompleted: 0,
            readingCompleted: 0,
            writingCompleted: 0,
            totalStars: 0,
        };
    }
}

export async function updateProgress(
    profileId: string,
    updates: Partial<UserProgress>
): Promise<void> {
    try {
        await setDoc(
            doc(db, 'progress', profileId),
            {
                ...updates,
                updatedAt: new Date().toISOString(),
            },
            { merge: true }
        );
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

export function onProgressChange(
    profileId: string,
    callback: (progress: UserProgress) => void
): Unsubscribe {
    return onSnapshot(doc(db, 'progress', profileId), (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data() as UserProgress);
        }
    });
}