import AppBar from "@/components/Navbar/navbar"
import Welcome from "@/components/Home/welcome"
import Image from "next/image"

const Home = () => {
  return (
    <div>
      <AppBar />
      <div className="relative w-full">
        <Image src="/assets/background-home.png" width={1000} height={100} alt="background-home" loading="eager" className="w-full h-auto brightness-50"></Image>
        <div className="absolute inset-0 bg-linear-to-b from-black to-transparent h-50"></div>
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black to-transparent h-100"></div>
        <div className="absolute inset-0 flex items-center justify-center z-10 mb-20">
          <Welcome />
        </div>
      </div>
    </div>
  )
}

export default Home