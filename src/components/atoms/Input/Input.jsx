export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        h-14
        px-4
        rounded-xl
        border
        border-gray-300
        shadow-sm
        outline-none
        focus:ring-2
        focus:ring-blue-500
      "
    />
  );
}