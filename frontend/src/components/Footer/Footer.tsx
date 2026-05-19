import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1f2a38] text-[#d1d5db] pt-[60px] font-sans">
      <div className="max-w-7xl mx-auto px-6 pb-10">
        {/* Top Section: 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          
          {/* COLUMN 1: Brand & About */}
          <div className="flex flex-col space-y-6 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <img 
                src="https://www.jcislmmidtown.com/assets/images/logo-default.png" 
                alt="JCI Logo" 
                className="h-16 w-auto brightness-0 invert object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed">
              JCI Salem Mid Town – Empowering Leaders, Inspiring Change. 
              <span className="text-[#f4b400] font-semibold italic ml-1">Join us</span> to make a difference.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 pt-2">
              <a href="#" className="hover:text-[#f4b400] transition-colors duration-300"><i className="fab fa-facebook-f text-lg"></i></a>
              <a href="#" className="hover:text-[#f4b400] transition-colors duration-300"><i className="fab fa-instagram text-lg"></i></a>
              <a href="#" className="hover:text-[#f4b400] transition-colors duration-300"><i className="fab fa-twitter text-lg"></i></a>
              <a href="#" className="hover:text-[#f4b400] transition-colors duration-300"><i className="fab fa-linkedin-in text-lg"></i></a>
            </div>
          </div>

          {/* COLUMN 2: Information */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
              Information
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#f4b400]"></span>
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">About Us</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Essentials */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
              Essentials
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#f4b400]"></span>
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/portfolio" className="footer-link">Business Portfolio</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Get In Touch */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
              Get In Touch
              <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-[#f4b400]"></span>
            </h4>
            <p className="text-white text-sm font-semibold mb-6 uppercase tracking-wider">Location and contact</p>
            <ul className="space-y-5">
              <li className="flex items-start justify-center md:justify-start space-x-3 group">
                <i className="fas fa-map-marker-alt text-[#f4b400] mt-1 group-hover:scale-110 transition-transform"></i>
                <span className="text-sm">Salem Tamilnadu, India</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3 group">
                <i className="fas fa-phone-alt text-[#f4b400] group-hover:scale-110 transition-transform"></i>
                <a href="tel:+919943055055" className="text-sm footer-link">+91 9943055055</a>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3 group">
                <i className="fas fa-envelope text-[#f4b400] group-hover:scale-110 transition-transform"></i>
                <a href="mailto:info@jcisalmmidtown.com" className="text-sm footer-link">info@jcisalmmidtown.com</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#17202a] py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0 tracking-wide">
          <p className="text-gray-400">
            &copy; 2024 JCI Salem Mid-Town. All Rights Reserved.
          </p>
          <p className="text-gray-400">
            Powered by <a href="#" className="text-[#f4b400] font-bold hover:underline transition-all">Techforge</a>
          </p>
        </div>
      </div>

      <style>{`
        .footer-link {
          transition: all 0.3s duration-300;
          position: relative;
        }
        .footer-link:hover {
          color: #f4b400;
          padding-left: 0.5rem;
        }
        .footer-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #f4b400;
          transition: all 0.3s;
        }
        .footer-link:hover::before {
          width: 100%;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
