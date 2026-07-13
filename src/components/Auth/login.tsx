'use client'

import { FaUser } from "react-icons/fa"
import { authClient } from "@/lib/auth-client"

const Login = () => {
    const handleSignIn = async (provider: "google" | "discord") => {
        await authClient.signIn.social({
            provider,
            callbackURL: "/profile" // redirect to account page after login
        })
    }

    return (
        <div className="w-full flex justify-center items-center h-screen">
            <div className="bg-zinc-900 py-5 px-5 w-100 h-80 rounded flex flex-col justify-center items-center gap-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-5">
                    <FaUser className="text-4xl text-yellow-500" />
                </div>
                {/* GOOGLE */}
                <button
                    onClick={() => handleSignIn('google')}
                    className="relative bg-zinc-900 w-full flex items-center justify-center border border-gray-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-zinc-800 transition cursor-pointer"
                >
                    <img
                        src="/assets/icons/google.png"
                        className="w-5 h-5 absolute left-6"
                        alt="Google"
                    />
                    <span>Masuk Dengan Google</span>
                </button>

                {/* DISCORD */}
                <button
                    onClick={() => handleSignIn('discord')}
                    className="relative bg-zinc-900 w-full flex items-center justify-center border border-gray-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-zinc-800 transition cursor-pointer"
                >
                    <img
                        src="/assets/icons/discord.svg"
                        className="w-5 h-5 absolute left-6"
                        alt="Discord"
                    />
                    <span>Masuk Dengan Discord</span>
                </button>
            </div>
        </div>

    )
}

export default Login