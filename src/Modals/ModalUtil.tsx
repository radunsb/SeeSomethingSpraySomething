import { TextFieldProps, DropdownProps } from "./ModalInterfaces.tsx";
import React, { useState, useEffect } from "react";


export const TextField = ({ value, onChange }: TextFieldProps) => {
  return (
    <input value={value} onChange={({ target: { value } }) => onChange(value)}/>
  );
};

export const Dropdown: React.FC<DropdownProps> = ({ options, currentSelected, onChange}) => {
  const [selectedValue, setSelectedValue] = useState<string>(options.length > 0 ? currentSelected : "");
  useEffect(() => {
    if (options.length > 0){
      setSelectedValue(currentSelected);
    }
  }, [options, currentSelected])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

return (
  <select value={selectedValue} onChange={handleChange}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
};
