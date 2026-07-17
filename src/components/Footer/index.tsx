'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { FaDiscord, FaTiktok, FaInstagram } from 'react-icons/fa';
import { FaHome, FaStore, FaVoteYea, FaUsers, FaUser, FaBars, FaTimes } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative border-t border-zinc-800 bg-[#0a0a0a] pt-16 pb-8 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-linear-to-r from-transparent via-yellow-500/50 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-24 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col space-y-4"
                    >
                        <Link href="/" className="flex items-center gap-3">
                            <Image src="/assets/esp-logo-small.png" alt="ESP Network Logo" width={80} height={80} className="w-5 h-5 md:w-10 md:h-10" />
                            <div className="font-bold text-yellow-500 hidden sm:block">ESP NETWORK</div>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                            Bergabunglah dengan komunitas Minecraft kami yang berkembang pesat. Jelajahi, bertahan hidup, dan bangun cerita epikmu bersama pemain lain!
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                        className="flex flex-col space-y-4"
                    >
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Tautan Cepat</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors text-sm w-fit"><FaHome /> Home</Link>
                            <Link href="/store" className="flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors text-sm w-fit"><FaStore /> Store</Link>
                            <Link href="/vote" className="flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors text-sm w-fit"><FaVoteYea /> Vote</Link>
                            <Link href="/team" className="flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors text-sm w-fit"><FaUser /> Team</Link>
                        </nav>
                    </motion.div>

                    {/* Socials & Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                        className="flex flex-col space-y-4"
                    >
                        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Komunitas Kami</h3>
                        <p className="text-zinc-400 text-sm">Ikuti kami untuk pembaruan terbaru dan event seru di server.</p>
                        <div className="flex space-x-4 mt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/20 transition-all duration-300">
                                <FaDiscord size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-pink-500 hover:bg-pink-500/20 transition-all duration-300">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-black hover:bg-zinc-800 transition-all duration-300">
                                <FaTiktok size={18} />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                    className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <p className="text-zinc-500 text-xs">
                        &copy; {currentYear} ESP Network. Semua Hak Cipta Dilindungi.
                    </p>
                    <p className="text-zinc-500 text-xs flex items-center gap-1.5">
                        Dibuat oleh
                        <a
                            href="https://youtube.com/@ArselAdy283"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium flex items-center gap-1"
                        >
                            ArselAdy
                        </a>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
