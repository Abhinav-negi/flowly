"use client";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

export default function SettingsPage() {
  // User states
  const [user, setUser] = useState<User | null>(null);
  const [isPasswordUser, setIsPasswordUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Mobile number states
  const [mobile, setMobile] = useState("");
  const [updatingMobile, setUpdatingMobile] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ type: "error" | "success"; message: string } | null>(null);

  // Load user info on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      setLoading(true);

      if (u) {
        setIsPasswordUser(u.providerData.some(p => p.providerId === "password"));

        try {
          const docRef = doc(db, "users", u.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as { phoneNumber?: string };
            if (data.phoneNumber) setMobile(data.phoneNumber);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          showNotification("error", "Failed to load user data");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const showNotification = (type: "error" | "success", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification("error", "Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      showNotification("error", "New password must be at least 6 characters");
      return;
    }

    setUpdatingPassword(true);
try {
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);

  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

  showNotification("success", "Password updated successfully!");
} catch (err) {
  const error = err as FirebaseError;

  switch (error.code) {
    case "auth/wrong-password":
      showNotification("error", "Current password is incorrect");
      break;
    case "auth/weak-password":
      showNotification("error", "New password is too weak");
      break;
    default:
      showNotification("error", error.message);
  }
} finally {
  setUpdatingPassword(false);
}

  const handleUpdateMobile = async () => {
    if (!user) return;
    if (!mobile) {
      showNotification("error", "Mobile number cannot be empty");
      return;
    }

    setUpdatingMobile(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { phoneNumber: mobile });
      showNotification("success", "Mobile number updated successfully!");
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to update mobile number");
    } finally {
      setUpdatingMobile(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E05265]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#E05265] mb-2">Settings</h1>
        <p className="text-gray-600">Manage your Flowly account</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg border-l-4 ${
          notification.type === "error" ? "border-red-500 bg-red-50 text-red-800" : "border-green-500 bg-green-50 text-green-800"
        }`}>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="text-lg leading-none hover:opacity-75 ml-4">×</button>
          </div>
        </div>
      )}

      {/* Mobile Number Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Mobile Number</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91xxxxxxxxxx"
            className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E05265] focus:border-transparent"
            disabled={updatingMobile}
          />
          <Button
            onClick={handleUpdateMobile}
            disabled={updatingMobile}
            className="bg-[#E05265] hover:bg-[#C04255] text-white rounded-md"
          >
            {updatingMobile ? "Updating..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Password Section */}
      {isPasswordUser && (
        <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Change Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E05265] focus:border-transparent"
            disabled={updatingPassword}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E05265] focus:border-transparent"
            disabled={updatingPassword}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E05265] focus:border-transparent"
            disabled={updatingPassword}
          />
          <Button
            onClick={handleChangePassword}
            disabled={updatingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="w-full bg-[#E05265] hover:bg-[#C04255] text-white rounded-md"
          >
            {updatingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      )}

      {/* Logout Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm flex justify-center">
        <LogoutButton />
      </div>

      {/* Support Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">Support</h2>
        <p className="text-gray-600 text-sm">Need help? Contact our support team:</p>
        <a
          href="mailto:flowwithflowly@gmail.com"
          className="text-[#E05265] hover:underline block"
        >
          flowwithflowly@gmail.com
        </a>
      </div>

      {/* App Info */}
      <div className="rounded-lg border bg-white p-4 shadow-sm text-center bg-gradient-to-r from-pink-50 to-red-50">
        <p className="text-[#E05265] font-bold">Flowly Dating App</p>
        <p className="text-gray-500 text-xs mt-1">Version 1.0.0 - Find Your Perfect Match</p>
      </div>
    </div>
  );
}
}