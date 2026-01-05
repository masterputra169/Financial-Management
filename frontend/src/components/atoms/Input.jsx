// src/components/atoms/Input.jsx
const Input = ({ label, type = "text", name, value, onChange, placeholder, required = false }) => {
  return (
    <div className="mb-5">
      <label className="block text-gray-700 font-semibold mb-2" htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
};

export default Input;