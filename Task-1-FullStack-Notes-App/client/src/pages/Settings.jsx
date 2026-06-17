import { useState } from "react";
import { FiCamera, FiLock, FiSave, FiSettings, FiUser } from "react-icons/fi";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import { useToast } from "../context/useToast";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Settings = () => {
  const { user, saveProfile, savePassword } = useAuth();
  const { setTheme } = useTheme();
  const { showToast } = useToast();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    themePreference: user?.themePreference || "system",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setProfileError("Avatar must be a PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > 1_500_000) {
      setProfileError("Avatar must be smaller than 1.5MB.");
      return;
    }

    const avatar = await fileToDataUrl(file);
    setProfileError("");
    setProfile((current) => ({ ...current, avatar }));
  };

  const handleThemeChange = (event) => {
    const nextTheme = event.target.value;
    setProfile((current) => ({ ...current, themePreference: nextTheme }));
    setTheme(nextTheme);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError("");

    try {
      const data = await saveProfile(profile);
      setTheme(data.user.themePreference || "system");
      showToast({ type: "success", title: "Profile updated" });
    } catch (err) {
      setProfileError(err.message);
      showToast({ type: "error", title: "Profile update failed", message: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      setSavingPassword(false);
      return;
    }

    try {
      await savePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast({ type: "success", title: "Password updated" });
    } catch (err) {
      setPasswordError(err.message);
      showToast({ type: "error", title: "Password update failed", message: err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  const initials =
    profile.name?.trim()?.charAt(0)?.toUpperCase() ||
    profile.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <section className="grid gap-8">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
          <FiSettings aria-hidden="true" /> Account
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Profile settings
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Manage your identity, avatar, password, and theme preference.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <Card as="form" className="grid gap-5 p-5 sm:p-6" onSubmit={handleProfileSubmit}>
          <div className="flex items-start gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-2xl font-black text-white shadow-glow">
              {profile.avatar ? (
                <img
                  alt=""
                  className="h-full w-full object-cover"
                  src={profile.avatar}
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-slate-950 dark:text-white">
                <FiUser aria-hidden="true" /> Profile
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Update how your account appears across NoteFlow.
              </p>
            </div>
          </div>

          {profileError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300">
              {profileError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Your name"
              maxLength={80}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <span>Avatar</span>
            <span className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/40">
              <FiCamera aria-hidden="true" /> Upload PNG, JPG, or WebP
            </span>
            <input
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
            />
          </label>

          {profile.avatar && (
            <Button
              className="w-fit"
              size="sm"
              variant="ghost"
              onClick={() => setProfile((current) => ({ ...current, avatar: "" }))}
            >
              Remove avatar
            </Button>
          )}

          <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <span>Theme preference</span>
            <select
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              name="themePreference"
              value={profile.themePreference}
              onChange={handleThemeChange}
            >
              <option value="system">Use system setting</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <Button type="submit" variant="primary" disabled={savingProfile}>
            <FiSave aria-hidden="true" />
            {savingProfile ? "Saving..." : "Save profile"}
          </Button>
        </Card>

        <Card as="form" className="grid gap-5 p-5 sm:p-6" onSubmit={handlePasswordSubmit}>
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-950 dark:text-white">
              <FiLock aria-hidden="true" /> Password
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Change your password with your current password.
            </p>
          </div>

          {passwordError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300">
              {passwordError}
            </div>
          )}

          <Input
            label="Current password"
            name="currentPassword"
            type="password"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            autoComplete="current-password"
            required
          />
          <Input
            label="New password"
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            minLength={6}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            minLength={6}
            autoComplete="new-password"
            required
          />

          <Button type="submit" variant="primary" disabled={savingPassword}>
            <FiSave aria-hidden="true" />
            {savingPassword ? "Updating..." : "Update password"}
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default Settings;
