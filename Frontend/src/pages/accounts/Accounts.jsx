import { useEffect, useState } from "react";
import { getAccounts } from "../../services/accountService";
import AccountCard from "../../components/accounts/AccountCard";
import CreateAccountModal from "../../components/accounts/CreateAccountModal";
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
  // console.log(accounts);
  if (loading) {
    return <Loader />;
  }
  if (!loading && accounts.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white">Accounts</h1>

            <p className="mt-2 text-slate-400">Total Accounts: 0</p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl text-white font-semibold"
          >
            + New Account
          </button>
        </div>

        <EmptyState
          title="No Accounts Yet"
          description="Create your first account to start managing your finances."
        />

        <CreateAccountModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onAccountCreated={fetchAccounts}
        />
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-white">Accounts</h1>

          <p className="mt-2 text-slate-400">
            Total Accounts: {accounts.length}
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl text-white font-semibold"
        >
          + New Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {accounts.map((account) => (
          <AccountCard key={account._id} account={account} />
        ))}
      </div>
      <CreateAccountModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onAccountCreated={fetchAccounts}
      />
    </div>
  );
}

export default Accounts;
