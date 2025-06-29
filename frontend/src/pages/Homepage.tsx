import Header from "@/components/home/Header";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import Footer from "@/components/home/Footer";

function Home() {
    return (
        <div className="min-h-screen w-screen bg-black text-white">
            <Header />
            <Features />
            <Pricing />
            <Footer />
        </div>
    );
}

export default Home;
