export interface NavbarButton {
  icon: any; // Replace React.ReactNode with the type of your icon component
  label: string;
  onClick?: (e: any) => void;
  type?: "button" | "submit" | "reset",
}

interface BottomNavbarProps {
  buttons: NavbarButton[];
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ buttons }) => {
  return (
    <div className="fixed bg-black bottom-0 left-0 w-full border-t border-gray-200 flex justify-evenly py-2">
      {buttons.map((button, index) => {
        const { type = 'button', onClick = () => {}, label, icon: Icon } = button
        return (
        <button
          key={index}
          type={type}
          className="flex flex-col items-center focus:outline-none"
          onClick={onClick}
        >
          <Icon />
          <span className="text-xs">{label}</span>
        </button>
      )})}
    </div>
  );
};

export default BottomNavbar;
