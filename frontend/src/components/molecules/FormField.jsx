// src/components/molecules/FormField.jsx
import Input from '../atoms/Input';
import Select from '../atoms/Select';

const FormField = ({ type, label, name, value, onChange, options, placeholder, required }) => {
  if (type === 'select') {
    return (
      <Select
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        required={required}
      />
    );
  }

  return (
    <Input
      label={label}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default FormField;