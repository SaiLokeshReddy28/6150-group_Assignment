import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, login } = useAuth(); // ← use global auth state

  // Load user from context, not storage
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
  });

  // Edit fields state
  const [edit, setEdit] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Load correct user on mount
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        photo:
          user.photo ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      });
    }
  }, [user]);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setProfile((prev) => ({ ...prev, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  // Save profile (local/session automatically handled)
  const saveProfile = () => {
    const updatedUser = {
      ...user,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      photo: profile.photo,
    };

    if (edit.password && newPassword.trim() !== "") {
      updatedUser.password = newPassword;
    }

    // Update global auth context → updates correct storage
    login(updatedUser, localStorage.getItem("finsight_token") || sessionStorage.getItem("finsight_token"), true);

    setMessage("Profile updated!");
    setTimeout(() => setMessage(""), 2000);

    // Turn off editing
    setEdit({ name: false, email: false, phone: false, password: false });
  };

  return (
    <div className="container py-4" style={{ maxWidth: "650px" }}>
      <h2 className="mb-4">Profile</h2>

      <div className="card shadow-sm p-4">
        {/* PHOTO */}
        <div className="text-center mb-4">
          <img
            src={profile.photo}
            alt="Profile"
            className="rounded-circle shadow-sm"
            style={{ width: 130, height: 130, objectFit: "cover", border: "3px solid #ddd" }}
          />
          <div className="mt-2">
            <label className="btn btn-outline-primary btn-sm">
              Change Photo
              <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
            </label>
          </div>
        </div>

        {/* NAME */}
        <div className="mb-4">
          <label className="form-label fw-bold">Full name</label>
          {!edit.name ? (
            <div>
              <span className="fs-5">{profile.name}</span>
              <button className="btn btn-link p-0 ms-2" onClick={() => setEdit((e) => ({ ...e, name: true }))}>
                ✏️ Edit
              </button>
            </div>
          ) : (
            <input
              className="form-control"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="form-label fw-bold">Email</label>
          {!edit.email ? (
            <div>
              <span className="fs-6">{profile.email}</span>
              <button
                className="btn btn-link p-0 ms-2"
                onClick={() => setEdit((e) => ({ ...e, email: true }))}
                disabled={!!user.photo} // google user email can't change
              >
                ✏️ Edit
              </button>
              {user.photo && (
                <small className="text-muted d-block">Google users cannot change email.</small>
              )}
            </div>
          ) : (
            <input
              className="form-control"
              value={profile.email}
              disabled={!!user.photo}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          )}
        </div>

        {/* PHONE */}
        <div className="mb-4">
          <label className="form-label fw-bold">Phone number</label>
          {!edit.phone ? (
            <div>
              <span className="fs-6">{profile.phone || "Not added"}</span>
              <button className="btn btn-link p-0 ms-2" onClick={() => setEdit((e) => ({ ...e, phone: true }))}>
                ✏️ Edit
              </button>
            </div>
          ) : (
            <input
              className="form-control"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="form-label fw-bold">Password</label>

          {!edit.password ? (
            <div>
              <span className="fs-6">********</span>
              <button
                className="btn btn-link p-0 ms-2"
                onClick={() => setEdit((e) => ({ ...e, password: true }))}
                disabled={!!user.photo}
              >
                ✏️ Edit
              </button>
              {user.photo && (
                <small className="text-muted d-block">
                  Google users cannot change password.
                </small>
              )}
            </div>
          ) : (
            <input
              type="password"
              className="form-control"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          )}
        </div>

        {/* SAVE */}
        <button className="btn btn-primary w-100" onClick={saveProfile}>
          Save Changes
        </button>

        {message && <p className="text-success mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
