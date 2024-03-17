const NavButton = ({ setActiveTab, activeTab, tab }) => {
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2  rounded-md  transition-colors capitalize ${
        activeTab == tab ? "font-bold" : "hover:font-semibold"
      }`}
    >
      {tab}
    </button>
  );
};

export default NavButton;
