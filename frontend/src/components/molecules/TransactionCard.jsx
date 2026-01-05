// src/components/molecules/TransactionCard.jsx
const TransactionCard = ({ title, amount, bgColor, textColor, titleColor, icon }) => {
  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-${textColor.replace('text-', '')} transform hover:-translate-y-1 cursor-pointer`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${titleColor} uppercase tracking-wide`}>
          {title}
        </h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${textColor}`}>
        Rp {amount.toLocaleString('id-ID')}
      </p>
      {/* Progress bar animasi */}
      <div className="mt-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full bg-white/50 rounded-full w-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default TransactionCard;