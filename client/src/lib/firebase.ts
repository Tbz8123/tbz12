
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvvGOplxJfW62OOa3yohzvR8_mhATGais",
  authDomain: "resumebuilder-d1a8d.firebaseapp.com",
  projectId: "resumebuilder-d1a8d",
  storageBucket: "resumebuilder-d1a8d.firebasestorage.app",
  messagingSenderId: "589651687240",
  appId: "1:589651687240:web:5e25659408bb509b04a57d",
  measurementId: "G-BGZNPYEQZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// API functions to interact with PostgreSQL backend
const API_BASE_URL = window.location.origin;

export const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  // Update the user's display name
  if (result.user) {
    await updateProfile(result.user, { displayName });

    // Create user record in PostgreSQL database
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: displayName,
          photoURL: result.user.photoURL,
          tier: 'FREE'
        }),
      });

      if (!response.ok) {
        console.error('Failed to create user in database:', await response.text());
      }
    } catch (error) {
      console.error('Error creating user in database:', error);
    }
  }

  return result;
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const result = await signInWithPopup(auth, googleProvider);

  // Create or update user record in PostgreSQL database
  if (result.user) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          tier: 'FREE'
        }),
      });

      if (!response.ok) {
        console.error('Failed to create user in database:', await response.text());
      }
    } catch (error) {
      console.error('Error creating user in database:', error);
    }
  }

  return result;
};

export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

// User data functions that use PostgreSQL backend
export const getUserData = async (uid: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const updateUserData = async (uid: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// New comprehensive user management functions
export const getUserProfile = async (uid: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/profile`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, profileData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserUsageStats = async (uid: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/usage`);

    if (!response.ok) {
      throw new Error(`Failed to fetch usage stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return null;
  }
};

export const trackUserUsage = async (uid: string, action: string, metadata?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/usage/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, metadata }),
    });

    if (!response.ok) {
      throw new Error(`Failed to track usage: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw error;
  }
};

export const getUserSubscription = async (uid: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/subscription`);

    if (!response.ok) {
      throw new Error(`Failed to fetch subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

export const getUserNotifications = async (uid: string, unreadOnly = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/notifications?unreadOnly=${unreadOnly}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (uid: string, notificationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const getUserPermissions = async (uid: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/permissions`);

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
};

export const createSupportTicket = async (uid: string, ticketData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${uid}/support-tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create support ticket: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
