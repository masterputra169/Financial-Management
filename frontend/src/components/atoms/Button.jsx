// src/components/atoms/Button.jsx
const Button = ({ children, onClick, type = "button", variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variants[variant]} px-6 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95`}
    >
      {children}
    </button>
  );
};

export default Button;