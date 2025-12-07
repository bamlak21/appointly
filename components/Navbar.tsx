const Navbar = () => {
  return (
    <nav className="flex justify-center py-4 bg-gradient-to-r from-amber-400 to-orange-500 items-center shadow-lg">
      <div className="flex items-center space-x-4 text-white">
        <h2 className="text-3xl font-bold tracking-wide">Appointly</h2>
        <h5 className="text-sm opacity-90">Schedule and manage your appointments effortlessly.</h5>
      </div>
    </nav>
  );
};

export default Navbar;
