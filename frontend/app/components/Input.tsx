interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ placeholder, value, onChange }: InputProps) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
        className="px-4 py-2 border rounded m-2"
      />
    </div>
  );
}
