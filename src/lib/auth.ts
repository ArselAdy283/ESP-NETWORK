import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql", // or "pg" or "sqlite"
        schema: schema,
    }),
    user: {
        additionalFields: {
            javaUsername: { type: "string", required: false, unique: true },
            bedrockUsername: { type: "string", required: false, unique: true },
            javaTextureId: { type: "string", required: false },
            bedrockTextureId: { type: "string", required: false },
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }
    }
});
