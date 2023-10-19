interface KeyButtonProps {
  code: string;
  onClick: () => void;
  disabled?: boolean;
}
export function KeyButton({ code, onClick, disabled }: KeyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-3xl font-bold p-4 text-amber-800 border-amber-800 border-2 disabled:border-gray-400 disabled:text-gray-400"
    >
      {code}
    </button>
  );
}
