const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t-2 border-primary-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="font-body text-primary-400 text-lg">
          TechMate AI © {new Date().getFullYear()} - Aprendiendo inglés con diversión 🚀
        </p>
      </div>
    </footer>
  );
};

export default Footer;
