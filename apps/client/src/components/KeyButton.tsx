interface KeyButtonProps {
  code: string;
  onClick: () => void;
  disabled?: boolean;
}
export function KeyButton({ code, onClick, disabled }: KeyButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {code}
    </button>
  );
}
