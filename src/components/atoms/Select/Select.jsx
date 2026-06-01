export default function Select({
  options,
  value,
  onChange,
}) {
  return (
    <select
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
    >
      <option value="">
        Selecione seu perfil
      </option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}