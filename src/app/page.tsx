import AppBar from "@/components/Navbar"
import Welcome from "@/components/Home/welcome"
import Image from "next/image"
import ServerInfoCard from "@/components/Home/ServerInfoCard"
import ContentSurvival from "@/components/Home/ContentSurvival"
import ContentFeatures from "@/components/Home/ContentFeatures"
import Footer from "@/components/Footer"
const Home = () => {
  return (
    <div>
      <AppBar />

      {/* Welcome Section */}
      <section className="relative w-full">
        <Image src="/assets/background-home.png" width={1000} height={100} alt="background-home" loading="eager" className="w-full h-auto brightness-50"></Image>
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a] to-transparent h-50"></div>
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#0a0a0a] to-transparent h-100"></div>
        <div className="absolute inset-0 flex items-center justify-center z-10 mb-25">
          <Welcome />
        </div>
      </section>

      <section id="server-info">
        <ServerInfoCard />
      </section>

      {/* Features Content */}
      <section id="features">
        <ContentSurvival />
        <ContentFeatures />
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

export default Home