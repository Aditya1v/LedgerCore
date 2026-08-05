function AboutCard() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white">
        About LedgerCore
      </h2>

      <div className="mt-6 space-y-3 text-slate-300">
        <p>
          <strong>Version:</strong> 1.0.0
        </p>

        <p>
          <strong>Stack:</strong> MERN
        </p>

        <p>
          <strong>Developer:</strong> Aditya Verma
        </p>
      </div>
    </div>
  );
}

export default AboutCard;