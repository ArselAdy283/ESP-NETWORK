"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { toast } from "sonner";
import { FiCopy } from "react-icons/fi";
import { useLenis } from "lenis/react";

const MotionLink = motion.create(Link);

const Welcome = () => {
    const lenis = useLenis();

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const logoVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8, x: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: { duration: 0.8, type: "spring", bounce: 0.4 },
        },
    };

    return (
        <motion.div
            className="flex gap-20 items-center"
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="flex flex-col">
                <h2 className="text-xl font-bold">Selamat Datang di ESP NETWORK</h2>
                <div
                    className="group relative inline-block mt-2 cursor-pointer w-fit"
                    onClick={() => {
                        navigator.clipboard.writeText("play.espnet.xyz");
                        toast.success("play.espnet.xyz disalin ke clipboard");
                    }}
                >
                    <h1 className="font-extrabold text-5xl text-yellow-500 pr-6">PLAY.ESPNET.XYZ</h1>
                    <FiCopy className="absolute bottom-1 right-0 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
                </div>
                <p className="text-xl mt-10 text-gray-300 leading-relaxed">
                    Bangun markasmu, kumpulkan sumber daya, Jelajahi dunia, <br /> dan ciptakan kisahmu sendiri.
                </p>
                <div className="mt-12 flex gap-5">
                    <MotionLink
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-black bg-yellow-500 rounded-lg px-6 py-3 font-bold cursor-pointer transition-colors hover:bg-yellow-400"
                    >
                        Mulai Bermain
                    </MotionLink>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-white border-yellow-500 border-2 rounded-lg px-6 py-3 font-bold cursor-pointer transition-colors hover:bg-yellow-500/10"
                        onClick={() => {
                            lenis?.scrollTo("#server-info", { offset: -120 });
                        }}
                    >
                        Lihat Lainnya
                    </motion.button>
                </div>
            </motion.div>
            <motion.div className="ml-30" variants={logoVariants}>
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 4,
                        ease: "easeInOut",
                    }}
                >
                    <Image src="/assets/esp-logo.png" alt="ESP Network Logo" width={500} height={500} className="drop-shadow-2xl" priority={true} />
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default Welcome