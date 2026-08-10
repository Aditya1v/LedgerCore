import { useEffect, useState } from "react";
import { Landmark, Plus } from "lucide-react";

import { getAccounts } from "../../services/accountService";
import AccountCard from "../../components/accounts/AccountCard";
import CreateAccountModal from "../../components/accounts/CreateAccountModal";
import PageContainer from "../../components/ui/PageContainer";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Accounts"
        subtitle={`${accounts.length} account${accounts.length === 1 ? "" : "s"} across your ledger.`}
        action={
          <Button icon={Plus} onClick={() => setOpenModal(true)}>
            New Account
          </Button>
        }
      />

      {loading ? (
        <Loader label="Loading accounts" />
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="No accounts yet"
          description="Create your first account to start managing your finances."
          action={
            <Button icon={Plus} onClick={() => setOpenModal(true)}>
              New Account
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      )}

      <CreateAccountModal isOpen={openModal} onClose={() => setOpenModal(false)} onAccountCreated={fetchAccounts} />
    </PageContainer>
  );
}

export default Accounts;
