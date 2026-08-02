import { User, Mail, Shield } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import EditProfileModal from "../../components/profile/EditProfileModal";
import ChangePasswordModal from "../../components/profile/ChangePasswordModal";

function Profile() {
  const { user } = useContext(AuthContext);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-white">
          Profile
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your account information and security.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-800 p-8">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">
                {user?.name}
              </h2>

              <p className="mt-1 text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex items-center gap-3">
                <User className="text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                  Name
                </h3>
              </div>

              <p className="mt-4 text-slate-300">
                {user?.name}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex items-center gap-3">
                <Mail className="text-green-400" />
                <h3 className="text-lg font-semibold text-white">
                  Email
                </h3>
              </div>

              <p className="mt-4 text-slate-300">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setOpenEditModal(true)}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>

            <button
              onClick={() => setOpenPasswordModal(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-white hover:bg-slate-700 transition"
            >
              <Shield size={18} />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />

      <ChangePasswordModal
        isOpen={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </>
  );
}

export default Profile;