import { useContext, useState } from "react";
import { Mail, Shield, User } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import EditProfileModal from "../../components/profile/EditProfileModal";
import ChangePasswordModal from "../../components/profile/ChangePasswordModal";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";

function Profile() {
  const { user } = useContext(AuthContext);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title="Profile" subtitle="Manage your account information and security." />

      <Card>
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar name={user?.name} size="xl" />

          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold text-ink">{user?.name}</h2>
            <p className="mt-1 text-[15px] text-ink-faint">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-line bg-surface-2 p-5">
            <div className="flex items-center gap-2.5">
              <User size={17} className="text-accent-hover" />
              <h3 className="text-sm font-semibold text-ink">Name</h3>
            </div>
            <p className="mt-3 text-[15px] text-ink-muted">{user?.name}</p>
          </div>

          <div className="rounded-card border border-line bg-surface-2 p-5">
            <div className="flex items-center gap-2.5">
              <Mail size={17} className="text-positive" />
              <h3 className="text-sm font-semibold text-ink">Email</h3>
            </div>
            <p className="mt-3 truncate text-[15px] text-ink-muted">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setOpenEditModal(true)}>Edit Profile</Button>
          <Button variant="secondary" icon={Shield} onClick={() => setOpenPasswordModal(true)}>
            Change Password
          </Button>
        </div>
      </Card>

      <EditProfileModal isOpen={openEditModal} onClose={() => setOpenEditModal(false)} />
      <ChangePasswordModal isOpen={openPasswordModal} onClose={() => setOpenPasswordModal(false)} />
    </PageContainer>
  );
}

export default Profile;
