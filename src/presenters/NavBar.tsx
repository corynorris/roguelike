import "./NavBar.css";

interface NavBarProps {
  level: number;
  health: number;
  power: number;
}

const NavBar = ({ level, health, power }: NavBarProps) => {
  return (
    <div className="NavBar">
      <div>{`Level: ${level || 0}`}</div>
      <div>{`HP: ${health || 0}`}</div>
      <div>{`Atk: ${power || 0}`}</div>
    </div>
  );
};

export default NavBar;
