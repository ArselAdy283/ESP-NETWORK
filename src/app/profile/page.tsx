import AppBar from "@/components/Navbar"
import Login from "@/components/Auth/login"
import ProfileComponents from "@/components/Profile"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const Account = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <div>
            <AppBar />
            {session ? <ProfileComponents /> : <Login />}
        </div>
    )
}

export default Account