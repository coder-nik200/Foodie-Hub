import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#1c1c1c] text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-14">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h1 className="flex items-center gap-2 text-[#ff5200]">
              <IoFastFoodOutline className="text-3xl" />
              <span className="font-bold text-2xl">Foodie Hub</span>
            </h1>
            <p className="text-sm mt-3 text-gray-400 leading-relaxed">
              Delicious meals, fresh ingredients & fast delivery — bringing
              happiness to your plate every day.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <li className="hover:text-white cursor-pointer">Home</li>
                <li className="hover:text-white cursor-pointer">Menu</li>
                <li className="hover:text-white cursor-pointer">Offers</li>
              </Link>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">FAQs</li>
              <li className="hover:text-white cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-white cursor-pointer">
                Terms & Conditions
              </li>
              <li className="hover:text-white cursor-pointer">Refund Policy</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-3">Follow Us</h4>

            <div className="flex gap-4 mt-2">
              {/* Gmail */}
              <a
                href="https://mail.google.com/mail/u/0/#inbox?compose=new"
                className="p-2 bg-[#2b2b2b] rounded-full hover:bg-[#ff5200] hover:scale-110 transition cursor-pointer text-white"
                aria-label="Gmail"
                title="Email us"
              >
                <MdEmail />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/wohh.nitish"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#2b2b2b] rounded-full hover:bg-[#ff5200] hover:scale-110 transition cursor-pointer text-white"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              {/* Twitter */}
              <a
                href="https://twitter.com/code_Bharti07"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#2b2b2b] rounded-full hover:bg-[#ff5200] hover:scale-110 transition cursor-pointer text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/nitish-kumar-631a37359"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#2b2b2b] rounded-full hover:bg-[#ff5200] hover:scale-110 transition cursor-pointer text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm">
          <p className="text-gray-400">
            © {new Date().getFullYear()} FoodieHub. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2 sm:mt-0">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
