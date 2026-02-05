import Header from "@/components/home/Header";
import Features from "@/components/home/Features";

import Footer from "@/components/home/Footer";

function Home() {
    return (
        <div className="min-h-screen w-screen bg-black text-white overflow-x-hidden">
            <Header />
            <Features />
            <Footer />
        </div>
    );
}

export default Home;
