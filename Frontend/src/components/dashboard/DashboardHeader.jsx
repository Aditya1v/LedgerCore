import { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function DashboardHeader() {
  const { user } = useContext(AuthContext);
  const firstName = user?.name?.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h1 className="font-display text-[28px] font-bold text-ink sm:text-[32px]">
        {getGreeting()}
        {firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-1.5 text-[15px] text-ink-faint">Here's your financial overview.</p>
    </motion.div>
  );
}

export default DashboardHeader;
