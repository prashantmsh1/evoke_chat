import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white pt-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-black/5 to-black/10 rounded-full blur-xl animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-gray-400/10 to-gray-600/20 rounded-full blur-2xl animate-[float_8s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-black/8 to-black/15 rounded-full blur-lg animate-[float_7s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-gray-300/15 to-gray-500/25 rounded-full blur-xl animate-[float_9s_ease-in-out_infinite_reverse]"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-[drift_20s_linear_infinite]"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-radial from-white/20 via-gray-100/10 to-transparent rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-radial from-black/5 via-gray-200/8 to-transparent rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite_reverse]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-black/5 rounded-full text-sm font-medium text-gray-600 mb-6 backdrop-blur-sm border border-white/20">
              Elite Development Partner
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight">
              Build Your{" "}
              <span className="italic bg-gradient-to-r from-gray-800 via-black to-gray-700 bg-clip-text text-transparent">Digital Empire</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We craft premium websites and mobile applications for athletes, businesses, and high-profile individuals who demand excellence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Start Your Project →
            </Button>
            <Button 
              onClick={() => scrollToSection('portfolio')}
              variant="outline" 
              className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-200 backdrop-blur-sm bg-white/50"
            >
              View Portfolio
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center backdrop-blur-sm bg-white/30 rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-black">20+</div>
              <div className="text-gray-600">iOS & Mobile Apps</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/30 rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-black">30+</div>
              <div className="text-gray-600">Shopify Stores</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/30 rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-black">100+</div>
              <div className="text-gray-600">Sites Built</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/30 rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-black">99%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
