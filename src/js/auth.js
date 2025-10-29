import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export const createUserDocument = async (uid, email, displayName = '') => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      uid,
      email,
      createdAt: serverTimestamp(),
    });

    const profileRef = doc(db, 'profiles', uid);
    await setDoc(profileRef, {
      userId: uid,
      displayName: displayName || email.split('@')[0],
      avatar: '',
      favoriteTeam: '',
      onboardingComplete: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('User documents created successfully');
  } catch (error) {
    console.error('Error creating user documents:', error);
    throw error;
  }
};

export const signUp = async (email, password, displayName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createUserDocument(userCredential.user.uid, email, displayName);
    return userCredential.user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(
        userCredential.user.uid,
        userCredential.user.email,
        userCredential.user.displayName || ''
      );
    }

    return userCredential.user;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const resetPassword = async email => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

export const observeAuthState = callback => {
  return onAuthStateChanged(auth, user => {
    callback(user);
  });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserProfile = async uid => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileDoc = await getDoc(profileRef);

    if (profileDoc.exists()) {
      return profileDoc.data();
    } else {
      console.log('No profile found for user:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
