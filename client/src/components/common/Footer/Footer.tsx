const Footer = () => {
  return (
    <footer className="mt-20 bg-[#fdfaf6] text-gray-700 rounded-t-2xl shadow-inner py-10 px-6 min-h-[120px]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} StayWithYoussef — All Rights
          Reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-yellow-700 transition">
            Privacy
          </a>
          <a href="#" className="hover:text-yellow-700 transition">
            Terms
          </a>
          <a href="#" className="hover:text-yellow-700 transition">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
