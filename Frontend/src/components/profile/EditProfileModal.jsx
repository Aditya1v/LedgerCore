import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "../../services/authService";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

function EditProfileModal({ isOpen, onClose }) {
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await updateProfile(formData);
      setUser(response.data);
      toast.success("Profile updated successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
