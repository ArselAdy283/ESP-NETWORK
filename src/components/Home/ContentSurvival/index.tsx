'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

const ContentSurvival = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex-1 space-y-6"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-sm font-semibold tracking-wide uppercase mb-2">
                        Fitur Unggulan
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        Survival <span className="text-yellow-500">Mix</span>
                    </h2>
                    <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl">
                        Rasakan pengalaman bermain Survival yang jauh lebih seru! Di Survival Mix, kami memadukan gameplay klasik dengan fitur-fitur modern seperti Custom Enchants, Sistem Ekonomi yang seimbang, dan tantangan unik lainnya. Bangun kerajaanku, kalahkan bos epik, dan jadilah yang terkuat di server!
                    </p>
                </motion.div>

                {/* Image Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="flex-1 w-full relative"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full transform -translate-y-10 scale-90 -z-10" />

                    <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
                        <Image
                            src="/assets/contents/survival-mix.png"
                            alt="Survival Mix Gameplay"
                            width={800}
                            height={600}
                            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 pointer-events-none"></div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default ContentSurvival;
