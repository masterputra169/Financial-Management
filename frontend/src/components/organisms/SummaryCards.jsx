// src/components/organisms/SummaryCards.jsx
import TransactionCard from '../molecules/TransactionCard';

const SummaryCards = ({ transactions }) => {
  const totalPemasukan = transactions
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalPengeluaran = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const saldo = totalPemasukan - totalPengeluaran;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <TransactionCard
        title="Total Pemasukan"
        amount={totalPemasukan}
        icon="💵"
        bgColor="bg-green-50"
        textColor="text-green-700"
        titleColor="text-green-800"
      />
      <TransactionCard
        title="Total Pengeluaran"
        amount={totalPengeluaran}
        icon="💸"
        bgColor="bg-red-50"
        textColor="text-red-700"
        titleColor="text-red-800"
      />
      <TransactionCard
        title="Saldo"
        amount={saldo}
        icon="💰"
        bgColor="bg-blue-50"
        textColor="text-blue-700"
        titleColor="text-blue-800"
      />
    </div>
  );
};

export default SummaryCards;