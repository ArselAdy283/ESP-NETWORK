"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaHome, FaStore, FaVoteYea, FaUsers, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const navItems = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "Store", path: "/store", icon: FaStore },
    { name: "Vote", path: "/vote", icon: FaVoteYea },
    { name: "Team", path: "/team", icon: FaUsers },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-black/50 backdrop-blur-md text-white shadow-md" : "bg-transparent text-white"}`}>
            <div className="flex items-center justify-between px-6 md:px-10 h-21 w-full">
                <Link href="/" className="flex items-center">
                    <Image src="/assets/esp-logo.png" alt="ESP Network Logo" width={80} height={80} className="w-16 h-16 md:w-20 md:h-20" />
                    <div className="font-bold text-yellow-500 hidden sm:block">ESP NETWORK</div>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <li key={item.name} className={`relative group flex items-center gap-2 cursor-pointer transition-colors ${isActive ? "text-yellow-500" : "hover:text-yellow-500"}`}>
                                <Link href={item.path} className="flex items-center gap-2">
                                    <Icon className="text-xl" /> {item.name}
                                </Link>
                                <span
                                    className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-0.5 w-full bg-yellow-500 transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                                />
                            </li>
                        );
                    })}
                </ul>

                <div className="flex items-center gap-4">
                    <Link href="/profile" className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 hover:bg-yellow-500 hover:text-black transition-colors cursor-pointer border border-white/20 hover:border-yellow-500 shadow-sm overflow-hidden shrink-0">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
                        ) : (
                            <FaUser className="text-base md:text-lg" />
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-2xl text-white hover:text-yellow-500 transition-colors focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-t border-white/10 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-96 py-6 opacity-100 shadow-xl" : "max-h-0 py-0 opacity-0"}`}>
                <div className="flex flex-col items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 text-xl transition-colors ${isActive ? "text-yellow-500" : "text-white hover:text-yellow-500"}`}
                            >
                                <Icon /> {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;