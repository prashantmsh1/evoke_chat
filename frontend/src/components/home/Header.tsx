import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();
    return (
        <header className="relative min-h-screen flex justify-center px-6 lg:px-12 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-black">
                <div className="hero-glow animate-pulse opacity-60"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            <div className="max-w-7xl h-screen flex flex-col items-center justify-center mx-auto w-full relative z-10">
                {/* Navigation */}
                <nav className="absolute top-8 left-0 right-0 flex justify-between items-center px-6 lg:px-12">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img
                                src="/evoke.svg"
                                alt="Evoke AI Logo"
                                className="w-8 h-8 relative z-10"
                            />
                        </div>
                        <span className="text-xl font-light tracking-wide text-white group-hover:text-gray-200 transition-colors">
                            Evoke AI
                        </span>
                    </div>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 glass-panel rounded-full text-sm font-light tracking-wide text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300">
                        Sign In
                    </button>
                </nav>

                {/* Hero Content */}
                <div className="text-center relative">
                    <div className="inline-flex items-center px-4 py-2 rounded-full glass-panel mb-8 animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-xs font-light text-gray-300 tracking-wider uppercase">
                            Next Generation Intelligence
                        </span>
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-thin leading-tight mb-8 tracking-tighter">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
                            Think Deeper.
                        </span>
                        <br />
                        <span className="text-gradient font-light">Create Faster.</span>
                    </h1>

                    <div className="max-w-4xl mx-auto mb-16">
                        <p className="text-xl lg:text-2xl font-light text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Experience the fusion of pro-grade LLMs and real-time web intelligence
                            in a beautifully crafted interface.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center space-x-3 text-sm font-medium tracking-wide">
                                <span>Get Started Free</span>
                                <ArrowRight
                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                    strokeWidth={1.5}
                                />
                            </div>
                        </button>
                        <button className="px-8 py-4 glass-panel rounded-full text-sm font-light tracking-wide text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center space-x-2">
                            <span>Watch Demo</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
            </div>
        </header>
    );
};

export default Header;
