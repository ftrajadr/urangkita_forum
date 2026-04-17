import { NavLink } from "react-router-dom";

const MyNavLink = ({ to, children, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex flex-col items-center gap-1 ${ isActive ? 'text-terracotta' : 'text-gray-400' }`}
  >
    <Icon size={24} />
    <span className="text-[10px] font-medium">{label}</span>
  </NavLink>
);

export default MyNavLink;