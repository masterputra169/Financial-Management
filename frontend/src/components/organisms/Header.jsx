const Header = ({ title }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
    </header>
  );
};

export default Header;