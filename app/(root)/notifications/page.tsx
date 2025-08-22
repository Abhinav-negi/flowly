"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: Timestamp;
  anchor?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Track user auth
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else {
        setUid(null);
        setNotifications([]);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Real-time listener for notifications
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "users", uid, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [uid]);

  // Automatically mark all unread notifications as read on view
  useEffect(() => {
    if (!uid || notifications.length === 0) return;

    const unreadNotifications = notifications.filter((n) => !n.read);

    unreadNotifications.forEach(async (notif) => {
      try {
        await updateDoc(
          doc(db, "users", uid, "notifications", notif.id),
          { read: true }
        );
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    });
  }, [uid, notifications]);

  // Format timestamp
  const formatTimestamp = (ts: Timestamp) => {
    if (!ts) return "";
    const date = ts.toDate();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!uid) return <p className="text-center mt-10">Please log in to see notifications</p>;

  return (
    <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto p-4 sm:p-6 min-h-[400px] mb-40">
      <h2 className="text-2xl sm:text-3xl font-bold font-secondary my-6 sm:my-10">
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
          <p>No notifications yet</p>
        </div>
      ) : (
        <ul className="flex-1 flex flex-col gap-2">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 sm:p-5 rounded cursor-pointer w-full transition-colors duration-150 ${
                notif.read
                  ? "bg-white hover:bg-gray-100"
                  : "bg-[#FFEAEA] hover:bg-[#FFD4D4]"
              }`}
              onClick={() => {
                if (notif.anchor) {
                  try {
                    const el = document.querySelector(notif.anchor);
                    el?.scrollIntoView({ behavior: "smooth" });
                  } catch {
                    console.warn("Invalid anchor selector:", notif.anchor);
                  }
                }
              }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <strong className="text-base sm:text-lg">{notif.title}</strong>
                <small className="text-gray-500 text-xs sm:text-sm">{notif.type}</small>
              </div>
              <p className="text-sm sm:text-base mt-1">{notif.body}</p>
              <small className="text-gray-400 text-xs mt-1 block">
                {formatTimestamp(notif.createdAt)}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
