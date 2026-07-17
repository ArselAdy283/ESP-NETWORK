'use client'

import { authClient } from "@/lib/auth-client"
import { saveGameAccounts } from "@/actions/profile"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { FiEdit2, FiCheck, FiX, FiLogOut, FiGrid, FiList, FiBox, FiLoader } from "react-icons/fi"
import { toast } from "sonner"

type GameAccountType = 'java' | 'bedrock';

interface GameAccount {
    username: string;
    uuid: string | null;
    textureId: string | null;
    isVerified: boolean;
    isLoading: boolean;
    isFetchingSkin: boolean;
}

interface GameAccountsState {
    java: GameAccount;
    bedrock: GameAccount;
}

const defaultAccountState: GameAccount = { username: "", uuid: null, textureId: null, isVerified: false, isLoading: false, isFetchingSkin: false };

const ProfileComponents = () => {
    const router = useRouter()
    const { data: session, isPending, refetch } = authClient.useSession()

    const [isEditing, setIsEditing] = useState(false)
    const [accountName, setAccountName] = useState("Loading...")

    const [gameAccounts, setGameAccounts] = useState<GameAccountsState>({
        java: { ...defaultAccountState },
        bedrock: { ...defaultAccountState }
    });

    const [editGameAccounts, setEditGameAccounts] = useState<GameAccountsState>({
        java: { ...defaultAccountState },
        bedrock: { ...defaultAccountState }
    });

    const [activeAccountType, setActiveAccountType] = useState<GameAccountType>('java');
    const [editAccountName, setEditAccountName] = useState("")
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        if (session?.user?.name) {
            setAccountName(session.user.name)
        }

        const fetchLatestSkin = async (username: string, type: GameAccountType) => {
            if (!username) {
                setGameAccounts(prev => ({ ...prev, [type]: { ...prev[type], isFetchingSkin: false } }));
                return;
            }
            try {
                const apiHeaders = {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ARSELADYCORE_BEARER}`,
                    "Content-Type": "application/json"
                };
                const playerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/player/${username}`, { headers: apiHeaders });
                if (!playerRes.ok) return;
                const playerData = await playerRes.json();
                const uuid = playerData.uuid || playerData.data?.uuid;
                if (!uuid) return;

                const skinRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/skin/${uuid}`, { headers: apiHeaders });
                if (!skinRes.ok) return;
                const skinData = await skinRes.json();
                const textureId = skinData.textureId || skinData.data?.textureId;

                if (textureId) {
                    setGameAccounts(prev => ({
                        ...prev,
                        [type]: { ...prev[type], textureId: textureId, isVerified: true, uuid: uuid }
                    }));
                }
            } catch (e) {
                console.error(`Background fetch failed for ${username}`, e);
            } finally {
                setGameAccounts(prev => ({
                    ...prev,
                    [type]: { ...prev[type], isFetchingSkin: false }
                }));
            }
        };

        if (session?.user) {
            // @ts-ignore
            const javaUser = session.user.javaUsername || "";
            // @ts-ignore
            const bedrockUser = session.user.bedrockUsername || "";
            // @ts-ignore
            const javaTex = session.user.javaTextureId || null;
            // @ts-ignore
            const bedrockTex = session.user.bedrockTextureId || null;

            const newState = {
                java: { ...defaultAccountState, username: javaUser, textureId: javaTex, isVerified: !!javaTex, isFetchingSkin: !!javaUser },
                bedrock: { ...defaultAccountState, username: bedrockUser, textureId: bedrockTex, isVerified: !!bedrockTex, isFetchingSkin: !!bedrockUser }
            };

            setGameAccounts(newState);

            if (!javaUser && bedrockUser) {
                setActiveAccountType('bedrock');
            }

            // Ambil skin terbaru di background
            if (javaUser) fetchLatestSkin(javaUser, 'java');
            if (bedrockUser) fetchLatestSkin(bedrockUser, 'bedrock');
        }
    }, [session?.user])

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                    router.refresh()
                }
            }
        })
    }

    const verifyAccount = async (type: GameAccountType) => {
        const acc = editGameAccounts[type];
        if (!acc.username) return;

        setEditGameAccounts(prev => ({
            ...prev,
            [type]: { ...prev[type], isLoading: true, isVerified: false }
        }));

        try {
            const apiHeaders = {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ARSELADYCORE_BEARER}`,
                "Content-Type": "application/json"
            };

            const fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/player/${acc.username}`;
            console.log(`[VERIFY] Memanggil API untuk ${type} username: "${acc.username}" dengan URL: ${fetchUrl}`);
            const playerRes = await fetch(fetchUrl, {
                headers: apiHeaders
            });

            if (!playerRes.ok) {
                const errorText = await playerRes.text().catch(() => "Tidak ada response body");
                console.error(`[VERIFY PLAYER ERROR] Status: ${playerRes.status} ${playerRes.statusText} for URL: ${fetchUrl}`, errorText);
                throw new Error(`Gagal (Player API: ${playerRes.status}) - ${acc.username}`);
            }

            const playerData = await playerRes.json();
            const uuid = playerData.uuid || playerData.data?.uuid;

            if (!uuid) throw new Error("UUID tidak ditemukan di response Player API");

            const skinFetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/skin/${uuid}`;
            console.log(`[VERIFY] UUID didapatkan: ${uuid}, mengambil skin dari URL: ${skinFetchUrl}`);
            const skinRes = await fetch(skinFetchUrl, {
                headers: apiHeaders
            });

            if (!skinRes.ok) {
                const errorText = await skinRes.text().catch(() => "Tidak ada response body");
                console.error(`[VERIFY SKIN ERROR] Status: ${skinRes.status} ${skinRes.statusText}`, errorText);
                throw new Error(`Gagal (Skin API: ${skinRes.status})`);
            }

            const skinData = await skinRes.json();
            console.log("[VERIFY] Skin API Response:", skinData);

            const textureId = skinData.textureId || skinData.data?.textureId;

            setEditGameAccounts(prev => ({
                ...prev,
                [type]: {
                    ...prev[type],
                    isLoading: false,
                    isVerified: true,
                    uuid: uuid,
                    textureId: textureId || uuid
                }
            }));
        } catch (error) {
            console.error(`Verification failed for ${type}:`, error);
            setEditGameAccounts(prev => ({
                ...prev,
                [type]: { ...prev[type], isLoading: false, isVerified: false, uuid: null, textureId: null }
            }));
            const errMsg = error instanceof Error ? error.message : "Error tidak diketahui";
            toast.error(`Username ${type} ini belum register di server`);
        }
    };

    const handleUsernameChange = (type: GameAccountType, value: string) => {
        let finalValue = value;
        if (type === 'bedrock') {
            if (finalValue.length > 0 && !finalValue.startsWith('.')) {
                finalValue = '.' + finalValue;
            }
        }

        setEditGameAccounts(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                username: finalValue,
                isVerified: false
            }
        }));
    };

    const startEditing = () => {
        setEditAccountName(accountName === "Loading..." ? "" : accountName)
        setEditGameAccounts(gameAccounts)
        setIsEditing(true)
    }

    const saveEdits = async () => {
        // Mencegah simpan jika username terisi tapi belum diverifikasi
        if (editGameAccounts.java.username && !editGameAccounts.java.isVerified) {
            toast.error("Harap verifikasi (Cek) Username Java Anda terlebih dahulu!");
            return;
        }

        if (editGameAccounts.bedrock.username && !editGameAccounts.bedrock.isVerified) {
            toast.error("Harap verifikasi (Cek) Username Bedrock Anda terlebih dahulu!");
            return;
        }

        // Cek ke server untuk mencegah duplikasi sebelum menyimpan state UI
        const res = await saveGameAccounts({
            javaUsername: editGameAccounts.java.username || null,
            bedrockUsername: editGameAccounts.bedrock.username || null,
            javaTextureId: editGameAccounts.java.textureId || null,
            bedrockTextureId: editGameAccounts.bedrock.textureId || null,
        });

        if (res.error) {
            toast.error(res.error);
            return; // Jangan keluar dari edit mode
        }

        setAccountName(editAccountName)
        setGameAccounts(editGameAccounts)
        setIsEditing(false)

        try {
            // @ts-ignore
            if (authClient.updateUser) {
                // @ts-ignore
                await authClient.updateUser({ name: editAccountName })
            }
        } catch (error) {
            console.error("Gagal update nama akun", error)
        }

        toast.success("Profil berhasil disimpan!");
        // Update session di background tanpa mereload halaman
        if (refetch) {
            await refetch();
        }
    }

    const cancelEdits = () => {
        setIsEditing(false)
    }

    const displayAccounts = isEditing ? editGameAccounts : gameAccounts;

    // Pastikan tipe yang ditampilkan tidak kosong jika ada tipe lain yang terisi
    let currentViewType = activeAccountType;
    if (!displayAccounts[currentViewType].username) {
        if (displayAccounts.java.username) currentViewType = 'java';
        else if (displayAccounts.bedrock.username) currentViewType = 'bedrock';
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-20 pt-16 mt-5">
            {/* Banner/Cover Image Section */}
            <div className="relative w-full h-48 md:h-64 lg:h-72 bg-linear-to-br from-zinc-900 via-zinc-800 to-yellow-900/40 shadow-[0_4px_30px_rgba(0,0,0,0.5)] overflow-hidden group border-b border-gray-800">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-[url('/assets/background-profile.png')] bg-cover bg-center bg-no-repeat opacity-50"></div>

                {/* Logout button top-right */}
                <div className="absolute top-6 right-6 flex gap-2">
                    <button
                        onClick={handleSignOut}
                        className="bg-red-600/90 hover:bg-red-500/90 text-zinc-300 hover:text-white p-3 rounded-xl backdrop-blur-md transition-all shadow-lg border border-gray-800 hover:border-red-500/50"
                        title="Keluar / Logout"
                    >
                        <FiLogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Profile Info Section (YouTube Style) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 md:-mt-24 mb-6 z-10">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-zinc-900/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-800">

                    {/* Avatar (mc-heads) */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border-4 border-gray-800 shrink-0 flex items-center justify-center relative">
                            {isPending || displayAccounts[currentViewType]?.isFetchingSkin ? (
                                <FiLoader className="animate-spin text-yellow-500" size={32} />
                            ) : (
                                <img
                                    src={displayAccounts[currentViewType].textureId
                                        ? `https://mc-heads.net/avatar/${displayAccounts[currentViewType].textureId}/160`
                                        : `https://mc-heads.net/avatar/${displayAccounts[currentViewType].username || 'Steve'}/160`}
                                    alt={`${displayAccounts[currentViewType].username} Avatar`}
                                    className="w-full h-full object-cover"
                                    style={{ imageRendering: 'pixelated' }}
                                    onError={(e) => { e.currentTarget.src = "https://mc-heads.net/avatar/Steve/160" }}
                                />
                            )}
                        </div>
                        {/* Toggle Account Type */}
                        {(displayAccounts.java.username && displayAccounts.bedrock.username) && (
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex bg-zinc-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg">
                                <button
                                    onClick={() => setActiveAccountType('java')}
                                    className={`px-3 py-1 text-xs font-bold transition-colors ${activeAccountType === 'java' ? 'bg-yellow-500 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Java
                                </button>
                                <button
                                    onClick={() => setActiveAccountType('bedrock')}
                                    className={`px-3 py-1 text-xs font-bold transition-colors ${activeAccountType === 'bedrock' ? 'bg-yellow-500 text-zinc-900' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    Bedrock
                                </button>
                            </div>
                        )}
                    </div>

                    {/* User Details */}
                    <div className="flex-1 text-center md:text-left mb-2 w-full mt-4 md:mt-0">
                        {isEditing ? (
                            <div className="flex flex-col gap-4 max-w-sm mx-auto md:mx-0 bg-zinc-950/50 p-4 rounded-xl border border-gray-800">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 block uppercase tracking-wider">Nama Akun</label>
                                    <input
                                        type="text"
                                        value={editAccountName}
                                        onChange={(e) => setEditAccountName(e.target.value)}
                                        className="w-full bg-zinc-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                                        placeholder="Nama Akun Anda"
                                    />
                                </div>

                                {/* Java Input */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 flex items-center justify-between uppercase tracking-wider">
                                        <span>Username Java</span>
                                        {editGameAccounts.java.isVerified && <span className="text-green-500 flex items-center gap-1 text-[10px]"><FiCheck /> Terverifikasi</span>}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editGameAccounts.java.username}
                                            onChange={(e) => handleUsernameChange('java', e.target.value)}
                                            className="flex-1 bg-zinc-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all min-w-0"
                                            placeholder="Username Java"
                                        />
                                        <button
                                            onClick={() => verifyAccount('java')}
                                            disabled={editGameAccounts.java.isLoading || !editGameAccounts.java.username}
                                            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 px-3 rounded-lg border border-gray-800 transition-colors flex items-center justify-center shrink-0"
                                            title="Verifikasi Akun"
                                        >
                                            {editGameAccounts.java.isLoading ? <FiLoader className="animate-spin text-yellow-500" /> : 'Cek'}
                                        </button>
                                    </div>
                                </div>

                                {/* Bedrock Input */}
                                <div>
                                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 flex items-center justify-between uppercase tracking-wider">
                                        <span>Username Bedrock</span>
                                        {editGameAccounts.bedrock.isVerified && <span className="text-green-500 flex items-center gap-1 text-[10px]"><FiCheck /> Terverifikasi</span>}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editGameAccounts.bedrock.username}
                                            onChange={(e) => handleUsernameChange('bedrock', e.target.value)}
                                            className="flex-1 bg-zinc-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all min-w-0"
                                            placeholder=".UsernameBedrock"
                                        />
                                        <button
                                            onClick={() => verifyAccount('bedrock')}
                                            disabled={editGameAccounts.bedrock.isLoading || !editGameAccounts.bedrock.username}
                                            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 px-3 rounded-lg border border-gray-800 transition-colors flex items-center justify-center shrink-0"
                                            title="Verifikasi Akun"
                                        >
                                            {editGameAccounts.bedrock.isLoading ? <FiLoader className="animate-spin text-yellow-500" /> : 'Cek'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <button onClick={saveEdits} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        <FiCheck size={18} /> Simpan
                                    </button>
                                    <button onClick={cancelEdits} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        <FiX size={18} /> Batal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 mb-5">
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                                    {accountName}
                                </h1>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {gameAccounts.java.username && (
                                        <div className="inline-flex items-center gap-2 bg-zinc-950/50 border border-gray-800 rounded-full px-4 py-1.5 shadow-inner">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-sm text-zinc-300">
                                                Java: <span className="text-yellow-500 font-semibold tracking-wide">{gameAccounts.java.username}</span>
                                            </span>
                                        </div>
                                    )}
                                    {gameAccounts.bedrock.username && (
                                        <div className="inline-flex items-center gap-2 bg-zinc-950/50 border border-gray-800 rounded-full px-4 py-1.5 shadow-inner">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            <span className="text-sm text-zinc-300">
                                                Bedrock: <span className="text-yellow-500 font-semibold tracking-wide">{gameAccounts.bedrock.username}</span>
                                            </span>
                                        </div>
                                    )}
                                    {!gameAccounts.java.username && !gameAccounts.bedrock.username && (
                                        <span className="text-sm text-zinc-500 italic">Belum ada akun game tertaut</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {!isEditing && (
                        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                            <button
                                onClick={startEditing}
                                className="flex-1 md:flex-none bg-zinc-800/80 hover:bg-yellow-500 hover:text-zinc-950 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-800 hover:border-yellow-500"
                            >
                                <FiEdit2 size={16} /> Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
                <div className="flex border-b border-gray-800 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'stats', label: 'Statistik' },
                        { id: 'inventory', label: 'Inventory' },
                        { id: 'achievements', label: 'Achievements' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 font-semibold text-sm md:text-base whitespace-nowrap transition-all relative ${activeTab === tab.id
                                ? "text-yellow-500"
                                : "text-zinc-400 hover:text-zinc-200"
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-t-full shadow-[0_-2px_10px_rgba(234,179,8,0.7)]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: 3D Skin Viewer (vzge.me) */}
                    <div className="order-2 lg:order-1 lg:col-span-4">
                        <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 border border-gray-800 flex flex-col items-center shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-linear-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="w-full flex justify-between items-center mb-6 z-10">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FiBox className="text-yellow-500" /> Model Karakter
                                </h3>
                            </div>

                            <div className="w-full max-w-60 h-112.5 relative z-10 flex items-center justify-center">
                                {/* vzge.me full skin render */}
                                {isPending || displayAccounts[currentViewType]?.isFetchingSkin ? (
                                    <FiLoader className="animate-spin text-yellow-500" size={48} />
                                ) : (
                                    <img
                                        src={displayAccounts[currentViewType].textureId
                                            ? `https://vzge.me/full/512/${displayAccounts[currentViewType].textureId}`
                                            : `https://vzge.me/full/512/${displayAccounts[currentViewType].username || 'Steve'}`}
                                        alt={`${displayAccounts[currentViewType].username} full skin`}
                                        className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500"
                                        style={{ imageRendering: 'pixelated' }}
                                        onError={(e) => { e.currentTarget.src = "https://vzge.me/full/512/Steve" }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Main Content */}
                    <div className="order-1 lg:order-2 lg:col-span-8">
                        <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-gray-800 shadow-lg min-h-125 flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FiList className="text-yellow-500" />
                                <span className="capitalize">{activeTab}</span> Konten
                            </h3>

                            {/* Placeholder for actual content */}
                            <div className="flex-1 border-2 border-dashed border-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/20">
                                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                                    <FiGrid size={24} className="text-zinc-600" />
                                </div>
                                <p className="text-lg text-center font-medium mb-2">Area Konten Kosong</p>
                                <p className="text-sm text-center text-zinc-600 max-w-md">
                                    Bagian ini siap diisi dengan komponen-komponen lain sesuai kebutuhan. Tab yang sedang aktif saat ini adalah <span className="text-yellow-500 font-mono bg-yellow-500/10 px-2 py-0.5 rounded">{activeTab}</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProfileComponents