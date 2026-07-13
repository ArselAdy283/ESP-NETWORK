"use server";

import { db } from "../db";
import { user } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export async function saveGameAccounts(data: {
    javaUsername: string | null;
    bedrockUsername: string | null;
    javaTextureId: string | null;
    bedrockTextureId: string | null;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Check if javaUsername is taken
        if (data.javaUsername) {
            const existing = await db.select().from(user).where(
                and(
                    eq(user.javaUsername, data.javaUsername),
                    ne(user.id, userId)
                )
            ).limit(1);
            if (existing.length > 0) {
                return { error: `Username Java '${data.javaUsername}' sudah didaftarkan oleh pengguna lain!` };
            }
        }

        // Check if bedrockUsername is taken
        if (data.bedrockUsername) {
            const existing = await db.select().from(user).where(
                and(
                    eq(user.bedrockUsername, data.bedrockUsername),
                    ne(user.id, userId)
                )
            ).limit(1);
            if (existing.length > 0) {
                return { error: `Username Bedrock '${data.bedrockUsername}' sudah didaftarkan oleh pengguna lain!` };
            }
        }

        // Update user
        await db.update(user).set({
            javaUsername: data.javaUsername || null,
            bedrockUsername: data.bedrockUsername || null,
            javaTextureId: data.javaTextureId || null,
            bedrockTextureId: data.bedrockTextureId || null,
        }).where(eq(user.id, userId));

        return { success: true };
    } catch (error) {
        console.error("Error saving game accounts:", error);
        return { error: "Terjadi kesalahan pada server saat menyimpan data." };
    }
}
