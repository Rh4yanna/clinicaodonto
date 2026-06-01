export default function Button({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        w-full
        h-14
        rounded-xl
        bg-amber-500
        text-blue-700
        font-bold
        text-xl
        hover:opacity-90
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
}