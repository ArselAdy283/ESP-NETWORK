"use server";

export async function getServerInfo() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // Membutuhkan header otorisasi seperti yang dilakukan di Profile/index.tsx
        const apiHeaders = {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ARSELADYCORE_BEARER}`,
            "Content-Type": "application/json"
        };
        
        const res = await fetch(`${apiUrl}/v1/server`, {
            headers: apiHeaders,
            cache: "no-store", // Jangan gunakan cache agar data selalu realtime
            signal: AbortSignal.timeout(5000) // Timeout 5 detik agar tidak freeze
        });

        if (!res.ok) {
            console.error("[getServerInfo] Gagal fetch API, status:", res.status);
            return { onlinePlayers: 0, status: "Offline" };
        }

        const data = await res.json();

        // Mengambil jumlah player online sesuai dengan struktur JSON asli dari API
        const onlinePlayers = data?.onlinePlayers ?? 0;

        return { onlinePlayers, status: "Online" };
    } catch (error) {
        console.error("[getServerInfo] Gagal mengambil data server:", error);
        return { onlinePlayers: 0, status: "Offline" };
    }
}
