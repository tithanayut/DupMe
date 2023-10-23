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
      className="z-10 text-3xl font-bold p-4 bg-white rounded-md rounded-t-none cursor-pointer hover:bg-cyan-500 
      focus:outline-none  text-black border-black border-2 disabled:border-gray-400 disabled:text-gray-400 disabled:pointer-events-none px-10 py-28
      "
      //   className="text-3xl font-bold p-4 text-amber-800 border-amber-800 border-2 disabled:border-gray-400 disabled:text-gray-400"
    >
      {code}
    </button>
  );
}
//<button class="absolute cursor-pointer bg-gray-900 h-28 w-5
//rounded-md rounded-t-none hover:bg-blue-800" style="margin-left: 24px;"></button>
//<button class="z-1 w-8 h-44 bg-white rounded-md rounded-t-none mr-1 cursor-pointer hover:bg-blue-600 focus:outline-none first:rounded-t-md last:rounded-t-md"></button>
