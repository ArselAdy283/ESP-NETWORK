'use client';

import { useState, useEffect } from "react";
import { FaServer, FaSignal } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";
import { getStaticServerInfo } from "./data-information";
import { getServerInfo } from "./action";
import { motion, type Variants, type TargetAndTransition } from "motion/react";

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
};

const hoverAnimation: TargetAndTransition = {
    y: -10,
    transition: {
        type: "spring",
        stiffness: 320,
        damping: 20,
    },
};

const ServerInfoCard = () => {
    const [onlinePlayers, setOnlinePlayers] = useState<number | string>("...");
    const [serverStatus, setServerStatus] = useState<string>("Checking...");

    const { serverVersion } = getStaticServerInfo();

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const data = await getServerInfo();

            if (!isMounted) return;

            setOnlinePlayers(data.onlinePlayers);
            setServerStatus(data.status);
        };

        fetchData();

        const interval = setInterval(fetchData, 15000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const cards = [
        {
            icon: <FiActivity size={32} />,
            title: onlinePlayers,
            subtitle: "Player Online",
            color: "text-white",
        },
        {
            icon: <FaServer size={32} />,
            title: serverVersion,
            subtitle: "Versi Server",
            color: "text-white",
        },
        {
            icon: <FaSignal size={32} />,
            title: serverStatus,
            subtitle: "Status Server",
            color:
                serverStatus === "Online"
                    ? "text-green-500"
                    : serverStatus === "Offline"
                        ? "text-red-500"
                        : "text-zinc-400",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 md:-mt-24 z-20 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {cards.map((card, index) => (
                    <motion.div
                        key={card.subtitle}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={hoverAnimation}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-3xl
                            border border-zinc-800
                            bg-zinc-900/50
                            backdrop-blur-xl
                            p-8
                            text-center
                            transition-[border-color,box-shadow]
                            duration-200
                            hover:border-gray-700/70
                            hover:shadow-[0_20px_50px_rgba(234,179,8,0.05)]
                        "
                    >
                        {/* Glow */}
                        <div
                            className="
                                absolute
                                inset-0
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity
                                duration-200
                                bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.03),transparent_65%)]
                            "
                        />

                        {/* Icon */}
                        <div
                            className="
                                relative
                                z-10
                                mx-auto
                                mb-6
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-zinc-800
                                bg-zinc-950/60
                                text-yellow-500
                                shadow-[0_0_20px_rgba(234,179,8,0.06)]
                                group-hover:border-gray-700
                            "
                        >
                            {card.icon}
                        </div>

                        {/* Value */}
                        <motion.h3
                            className={`relative z-10 text-4xl font-black tracking-tight mb-2 ${card.color}`}
                        >
                            {card.title}
                        </motion.h3>

                        {/* Label */}
                        <p className="relative z-10 text-xs md:text-sm uppercase tracking-[0.25em] font-semibold text-zinc-400">
                            {card.subtitle}
                        </p>
                    </motion.div>
                ))}

            </div>
        </div>
    );
};

export default ServerInfoCard;