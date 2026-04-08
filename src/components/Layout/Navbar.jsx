


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import notificationService from "../../services/NotificationService";
import patientService      from "../../services/patientService";
import insuranceService from "../../services/InsuranceCompanyService";
import providerService     from "../../services/ProviderService";
import "./Navbar.css";

const getRoleConfig = (role) => {
  const r = (role || "").toLowerCase();

  if (r === "patient") {
    return {
      profilePath:  "/patient/profile",
      fetchProfile: () => patientService.getProfile(),
    };
  }
  if (r === "healthcareprovider" || r === "provider") {
    return {
      profilePath:  "/provider/profile",
      fetchProfile: () => providerService.getProfile(),
    };
  }
 if (r === "insurancecompany") {
  return {
    profilePath: "/insurance/profile",
    fetchProfile: () => insuranceService.getProfile(), // ✅ FIX
  };
}
 
  return { profilePath: null, fetchProfile: null };
};

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const [fullName,      setFullName]      = useState(localStorage.getItem("fullName") || "");
  const [email,         setEmail]         = useState(localStorage.getItem("email")    || "");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [showNotif,     setShowNotif]     = useState(false);
  const [showProfile,   setShowProfile]   = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const { profilePath, fetchProfile } = getRoleConfig(role);

  
  useEffect(() => {
    if (!fetchProfile) return;
    fetchProfile()
      .then((data) => {
        const name =
          data.fullName     ||
          data.name         ||
          data.hospitalName ||   
          data.companyName  ||   
          "";
        if (name) setFullName(name);
        if (data.email) setEmail(data.email);
      })
      .catch(() => {  });
  }, [role]); 

  
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

 
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(typeof data === "number" ? data : data?.count ?? 0);
    } catch {  }
  };

  const toggleNotif = async () => {
    const next = !showNotif;
    setShowNotif(next);
    setShowProfile(false);
    if (next) {
      try {
        const data = await notificationService.getMyNotifications();
        setNotifications(Array.isArray(data) ? data : data?.notifications ?? []);
      } catch {  }
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {  }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleGoToProfile = () => {
    setShowProfile(false);
    if (profilePath) navigate(profilePath);
  };


  const displayName = fullName || role || "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="topbar">
      <div>
        <p className="welcome">Welcome back</p>
        <h6 className="mb-0 fw-semibold text-dark">{displayName}</h6>
      </div>

      <div className="top-right">
        <span className="role-badge">{role}</span>

        {/* Bell */}
        <div className="nav-icon-wrap" ref={notifRef}>
          <button className="nav-icon-btn" onClick={toggleNotif} title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="dropdown-panel notif-panel">
              <div className="panel-header">
                <span className="fw-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-muted small">{unreadCount} unread</span>
                )}
              </div>
              <div className="panel-body">
                {notifications.length === 0 ? (
                  <p className="empty-msg">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.isRead ? "notif-item--unread" : ""}`}
                      onClick={() => !n.isRead && handleMarkRead(n.id)}
                    >
                      <p className="notif-msg">{n.message}</p>
                      <span className="notif-time">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="nav-icon-wrap" ref={profileRef}>
          <button
            className="avatar-btn"
            onClick={() => { setShowProfile((p) => !p); setShowNotif(false); }}
            title="Profile"
          >
            {initials}
          </button>

          {showProfile && (
            <div className="dropdown-panel profile-panel">
              <div className="panel-header">
                <div className="avatar-lg">{initials}</div>
                <div>
                  <p className="mb-0 fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>
                    {displayName}
                  </p>
                  {/* <p className="mb-0 text-muted" style={{ fontSize: "0.78rem" }}>
                    {email}
                  </p> */}
                </div>
              </div>
              <div className="panel-body">
                {profilePath && (
                  <>
                    <button className="profile-menu-item" onClick={handleGoToProfile}>
                      👤 &nbsp; My Profile
                    </button>
                    <hr className="my-1" />
                  </>
                )}
                <button className="profile-menu-item text-danger" onClick={logout}>
                  🚪 &nbsp; Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;