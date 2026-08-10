import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "../../services/authService";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Change Password"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="flex justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Change Password
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ChangePasswordModal;
