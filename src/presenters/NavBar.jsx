import React from 'react';
import './NavBar.css'

const NavBar = ({
  level,
  health,
  power,
}) => {
  return (
    <div className="NavBar">
      <div>{`Level: ${level || 0}`}</div> 
      <div>{`HP: ${health || 0}`}</div> 
      <div>{`Atk: ${power || 0}`}</div>
    </div>
  );
};

export default NavBar;