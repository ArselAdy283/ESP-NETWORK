'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { FaChevronDown } from 'react-icons/fa';

const features = [
    {
        id: 1,
        title: "Sistem Ekonomi Global",
        content: "Jadilah pemain terkaya di server dengan berdagang, menjalankan bisnis, atau bekerja di berbagai profesi yang tersedia."
    },
    {
        id: 2,
        title: "Custom Enchants & Items",
        content: "Ratusan enchantment unik dan item khusus yang tidak ada di Vanilla Minecraft untuk memperkuat perlengkapanmu."
    },
    {
        id: 3,
        title: "Dungeon & Bos Epik",
        content: "Tantang dirimu dengan menjelajahi dungeon mematikan dan kalahkan bos epik untuk mendapatkan hadiah langka."
    },
    {
        id: 4,
        title: "Komunitas Ramah & Aktif",
        content: "Bergabung dengan ratusan pemain lain. Sistem anti-griefing kami memastikan bangunanmu tetap aman dari gangguan."
    }
];

const ContentFeatures = () => {
    const [openId, setOpenId] = useState<number | null>(1);

    const toggleAccordion = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">

                {/* Image Content (Left) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex-1 w-full relative order-2 md:order-1"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full transform translate-y-10 scale-90 -z-10" />

                    <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
                        <Image
                            src="/assets/contents/feature.png"
                            alt="Server Features"
                            width={800}
                            height={600}
                            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 pointer-events-none"></div>
                    </div>
                </motion.div>

                {/* Accordion Content (Right) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="flex-1 space-y-6 order-1 md:order-2 w-full"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-sm font-semibold tracking-wide uppercase mb-2">
                        Fitur Server
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        Kenapa Memilih <span className="text-yellow-500">ESP Network?</span>
                    </h2>
                    <p className="text-zinc-400 text-base leading-relaxed mb-8">
                        Kami menyediakan berbagai fitur menarik yang dirancang khusus untuk memberikan pengalaman bermain terbaik.
                    </p>

                    <div className="space-y-4">
                        {features.map((feature) => (
                            <div
                                key={feature.id}
                                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openId === feature.id ? 'border-yellow-500/50 bg-zinc-900/80 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'}`}
                            >
                                <button
                                    onClick={() => toggleAccordion(feature.id)}
                                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                                >
                                    <span className={`font-bold text-lg transition-colors duration-300 ${openId === feature.id ? 'text-yellow-500' : 'text-white'}`}>
                                        {feature.title}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openId === feature.id ? 180 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className={`text-sm ${openId === feature.id ? 'text-yellow-500' : 'text-zinc-500'}`}
                                    >
                                        <FaChevronDown />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openId === feature.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-5 pt-0 text-zinc-400 text-base leading-relaxed">
                                                {feature.content}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default ContentFeatures;
