import React from "react";
import { Brain, Search, Zap, Shield, BarChart3, Users } from "lucide-react";

const Features: React.FC = () => {
    const features = [
        {
            icon: Brain,
            title: "Pro LLM Access",
            description:
                "Access to the most advanced language models with superior reasoning capabilities.",
        },
        {
            icon: Search,
            title: "Real-time Web Search",
            description:
                "Every response includes unlimited, up-to-date web search results for accuracy.",
        },
        {
            icon: Zap,
            title: "Lightning Speed",
            description:
                "Optimized infrastructure delivers responses in milliseconds, not seconds.",
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-level encryption and privacy protection for all conversations.",
        },
        {
            icon: BarChart3,
            title: "Advanced Analytics",
            description: "Detailed insights into usage patterns and conversation effectiveness.",
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Share conversations, build knowledge bases, and collaborate seamlessly.",
        },
    ];

    return (
        <section className="py-32 px-6 lg:px-12 bg-gradient-to-b from-[#404040] via-[#2A2A2A] to-[#1C1C1C]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-24">
                    <h2 className="text-3xl lg:text-4xl font-extralight mb-6 text-white tracking-tight">
                        Why Choose Evoke AI
                    </h2>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-8"></div>
                    <p className="text-lg font-light text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Experience the next generation of AI conversations with cutting-edge
                        features designed for professionals.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {features.map((feature, index) => (
                        <div key={index} className="group text-center">
                            <div className="mb-8 flex justify-center">
                                <div className="w-16 h-16 border border-white/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm flex items-center justify-center group-hover:border-white/30 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-transparent transition-all duration-300">
                                    <feature.icon
                                        className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            </div>

                            <h3 className="text-xl font-light mb-4 text-white tracking-wide">
                                {feature.title}
                            </h3>

                            <p className="text-gray-400 font-light leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Demo Section */}
                <div className="mt-32 text-center">
                    <div className="border border-white/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-16 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-extralight mb-6 text-white tracking-tight">
                            See It In Action
                        </h3>
                        <p className="text-gray-400 font-light mb-8 leading-relaxed">
                            Experience the power of Evoke AI with our interactive demonstration
                        </p>
                        <button className="px-8 py-3 border border-white/20 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm text-sm font-light tracking-wide text-gray-300 hover:text-white hover:border-white/30 hover:from-white/10 transition-all duration-300">
                            Launch Demo
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
