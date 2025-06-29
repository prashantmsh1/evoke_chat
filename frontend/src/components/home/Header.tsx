import React from "react";
import { Brain, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();
    return (
        <header className="relative min-h-screen flex  justify-center px-6 lg:px-12 bg-gradient-to-br from-[#1C1C1C] via-[#2A2A2A] to-[#404040]">
            {/* Subtle overlay for texture */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>

            <div className="max-w-7xl h-screen flex flex-col items-center justify-center mx-auto w-full relative z-10">
                {/* Navigation */}
                <nav className="absolute top-8 left-0 right-0 flex justify-between items-center px-6 lg:px-12">
                    <div className="flex items-center space-x-3">
                        <Brain className="w-7 h-7 text-white" strokeWidth={1.5} />
                        <span className="text-xl font-light tracking-wide text-white">
                            Evoke AI
                        </span>
                    </div>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 border border-white/20 backdrop-blur-sm text-sm font-light tracking-wide text-gray-300 hover:text-white hover:border-white/30 transition-all duration-300">
                        Sign In
                    </button>
                </nav>

                {/* Hero Content */}
                <div className="text-center  ">
                    <h1 className="text-5xl lg:text-7xl font-extralight leading-tight mb-8 tracking-tight">
                        <span className="text-white drop-shadow-sm">Evoke AI Chat</span>
                    </h1>

                    <div className="max-w-4xl mx-auto mb-16">
                        <p className="text-xl lg:text-2xl font-light text-gray-300 mb-4 leading-relaxed drop-shadow-sm">
                            Advanced AI Conversations
                        </p>
                        <p className="text-lg font-light text-gray-400 leading-relaxed">
                            Powered by Pro LLMs with unlimited web search results
                        </p>
                    </div>

                    {/* Minimal feature indicators */}
                    <div className="flex justify-center space-x-12 mb-16 text-sm font-light text-gray-400">
                        <span className="border-b border-white/20 pb-1">Lightning Fast</span>
                        <span className="border-b border-white/20 pb-1">Web Search</span>
                        <span className="border-b border-white/20 pb-1">Pro LLMs</span>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button className="group px-8 py-4 bg-white text-black text-sm font-medium tracking-wide hover:bg-gray-100 transition-all duration-300 flex items-center space-x-3 shadow-lg">
                            <span>Get Started</span>
                            <ArrowRight
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                strokeWidth={1.5}
                            />
                        </button>
                        <button className="px-8 py-4 border border-white/20 backdrop-blur-sm text-sm font-light tracking-wide text-gray-300 hover:text-white hover:border-white/30 transition-all duration-300">
                            View Demo
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
