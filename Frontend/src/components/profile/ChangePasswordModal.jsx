import { useState } from "react";

import { toast } from "sonner";
import { changePassword } from "../../services/authService";
import PasswordInput from "../ui/PasswordInput";

function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success("Password changed successfully.");

      resetForm();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8">
        <h2 className="text-2xl font-bold text-white">Change Password</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <PasswordInput
  label="Current Password"
  name="currentPassword"
  value={formData.currentPassword}
  show={showCurrent}
  setShow={setShowCurrent}
  onChange={handleChange}
/>

          <PasswordInput
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            show={showNew}
            setShow={setShowNew}
            onChange={handleChange}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="rounded-xl border border-slate-700 px-5 py-2 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
