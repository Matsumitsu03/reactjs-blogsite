import { useState, useEffect, useContext, useRef } from "react";
import { updateEmail, updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "@firebase/auth";
import { getFirestore, doc, updateDoc, query, where, getDocs, collection } from "firebase/firestore";
import { AuthContext } from "../context/AuthProvider";
import { getAuth } from "firebase/auth";
import Header from "./Header";

const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@(.+)$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const Account = () => {
  const { currentUser } = useContext(AuthContext);
  const firestore = getFirestore();
  const firebaseAuth = getAuth();

  const [currentPasswordUsername, setCurrentPasswordUsername] = useState('');
  const [currentPasswordEmail, setCurrentPasswordEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    if (currentUser) {
      setNewUsername(currentUser.displayName || "");
      setNewEmail(currentUser.email || "");
    }
  }, [currentUser]);

  useEffect(() => {
    setValidUsername(newUsername.length >= 6); 
  }, [newUsername]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(newEmail));
  }, [newEmail]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(newPassword));
  }, [newPassword]);

  const checkUsernameAvailability = async (username) => {
    try {
      const userQuery = query(collection(firestore, 'users'), where('username', '==', username));
      const userQuerySnapshot = await getDocs(userQuery);

      return userQuerySnapshot.empty;
    } catch (err) {
      console.error('Error checking username availability:', err);
      throw err;
    }
  };

  const checkPasswordCorrectness = async (password) => {
    try {
      const user = firebaseAuth.currentUser;

      if (!user) {
        return false;
      }

      const credential = EmailAuthProvider.credential(user.email, password);

      await reauthenticateWithCredential(user, credential);

      return true;
    } catch (err) {
      console.error('Error checking password correctness:', err);
      return false;
    }
  };

  const updateUsernameHandler = async () => {
    try {
      const user = firebaseAuth.currentUser;

      if (!user) {
        setErrMsg("User not logged in.");
        return;
      }

      const isUsernameAvailable = await checkUsernameAvailability(newUsername);

      if (!isUsernameAvailable) {
        setErrMsg("Username is already taken.");
        return;
      }

      const isPasswordCorrect = await checkPasswordCorrectness(currentPassword);

      if (!isPasswordCorrect) {
        setErrMsg("Incorrect password for username change.");
        return;
      }

      const userId = user.uid;
      const userDocRef = doc(firestore, "users", userId);

      await updateDoc(userDocRef, { username: newUsername });

      await updateProfile(user, {
        displayName: newUsername,
      });

      setErrMsg("Username updated successfully.");
    } catch (error) {
      setErrMsg("Error updating username: " + error.message);
    }
  };
  
  const isEmailInUse = async (email) => {
    try {
      const userQuery = query(collection(firestore, 'users'), where('email', '==', email));
      const userQuerySnapshot = await getDocs(userQuery);
  
      return !userQuerySnapshot.empty;
    } catch (err) {
      console.error('Error checking email availability:', err);
      throw err;
    }
  };

  const updateEmailHandler = async () => {
    try {
      const user = firebaseAuth.currentUser;
  
      if (!user) {
        setErrMsg("User not logged in.");
        return;
      }
  
      if (!EMAIL_REGEX.test(newEmail)) {
        setErrMsg("Invalid email format.");
        return;
      }
  
      const isEmailTaken = await isEmailInUse(newEmail);
  
      if (isEmailTaken) {
        setErrMsg("Email is already in use.");
        return;
      }

      const isPasswordCorrect = await checkPasswordCorrectness(currentPassword);
  
      if (!isPasswordCorrect) {
        setErrMsg("Incorrect password for email change.");
        return;
      }
  
      await updateEmail(user, newEmail);
  
      const userId = user.uid;
      const userDocRef = doc(firestore, "users", userId);
  
      await updateDoc(userDocRef, { email: newEmail });
  
      setErrMsg("Email updated successfully.");
    } catch (error) {
      setErrMsg("Error updating email: " + error.message);
    }
  };
  
  const updatePasswordHandler = async () => {
    try {
      const user = firebaseAuth.currentUser;
  
      if (!user) {
        setErrMsg("User not logged in.");
        return;
      }
      const isPasswordCorrect = await checkPasswordCorrectness(currentPassword);
  
      if (!isPasswordCorrect) {
        setErrMsg("Incorrect current password.");
        return;
      }
  
      if (!PWD_REGEX.test(newPassword)) {
        setErrMsg("Password should be 8 to 24 characters and include uppercase, lowercase, and a number.");
        return;
      }
  
      if (newPassword === currentPassword) {
        setErrMsg("New password cannot be the same as the current password.");
        return;
      }
  
      await updatePassword(user, newPassword);
  
      setErrMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrMsg("Error updating password: " + error.message);
    }
  };  

  return (
    <div>
        <Header/>
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>

        <div className="mb-4">
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="Password"
            value={currentPasswordUsername}
            onChange={(e) => setCurrentPasswordUsername(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={updateUsernameHandler}
          disabled={!validUsername}
        >
          Update Username
        </button>

        <div className="mt-6 mb-4">
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="Password"
            value={currentPasswordEmail}
            onChange={(e) => setCurrentPasswordEmail(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={updateEmailHandler}
          disabled={!validEmail}
        >
          Update Email
        </button>

        <div className="mt-6 mb-4">
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="New Password"
            value={newPassword}
            ref={newPasswordRef}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="border p-2 w-full rounded"
            placeholder="Confirm New Password"
            value={confirmPassword}
            ref={confirmPasswordRef}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={updatePasswordHandler}
          disabled={!validPassword || newPassword !== confirmPassword}
        >
          Update Password
        </button>
        <p className="text-red-500 mt-2">{errMsg}</p>
      </div>
    </div>
    </div>
  );
};

export default Account;
