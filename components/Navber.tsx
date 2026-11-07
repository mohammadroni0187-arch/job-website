import Image from "next/image";
import Link from "next/link";

const Navber = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4 lg:px-10">

      {/* Left: Logo + Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li><a>Browse Jobs</a></li>
            <li><a>Company</a></li>
            <li><a>Pricing</a></li>
            <li><a>Sign In</a></li>
            <li><a>Get Started</a></li>
          </ul>
        </div>

         <Link href="/" className="btn btn-ghost text-xl font-bold">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={80}
            height={80}
            priority
          />
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a>Browse Jobs</a></li>
          <li><a>Company</a></li>
          <li><a>Pricing</a></li>
        </ul>
      </div>

      {/* Right: Authentication Buttons */}
      <div className="navbar-end gap-3">
        <button className="btn btn-ghost">
          Sign In
        </button>

        <button className="btn btn-primary">
          Get Started
        </button>
      </div>

    </div>
  );
};

export default Navber;
