import React from "react";
import { Brain, Search, Zap, Shield, BarChart3, Users, ArrowUpRight } from "lucide-react";

const Features: React.FC = () => {
    const features = [
        {
            icon: Brain,
            title: "Pro LLM Access",
            description: "Advanced reasoning capabilities with top-tier models.",
        },
        {
            icon: Search,
            title: "Real-time Search",
            description: "Live web access for accurate, up-to-date responses.",
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Optimized infrastructure for millisecond latency.",
        },
        {
            icon: Shield,
            title: "Secure by Design",
            description: "Enterprise-grade encryption and data privacy.",
        },
        {
            icon: BarChart3,
            title: "Deep Analytics",
            description: "Insights into usage patterns and performance.",
        },
        {
            icon: Users,
            title: "Team Sync",
            description: "Seamless collaboration and knowledge sharing.",
        },
    ];

    return (
        <section className="py-32 px-6 lg:px-12 bg-black relative">
            <div className="max-w-7xl mx-auto">
                <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-thin text-white mb-6 tracking-tight">
                            Engineered for <br />
                            <span className="text-gray-500">Excellence</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 font-light max-w-sm text-lg leading-relaxed text-right md:text-left">
                        A complete suite of tools designed to elevate your AI interaction
                        experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 glass-panel rounded-2xl hover:bg-white/5 transition-all duration-500 cursor-default relative overflow-hidden">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowUpRight className="w-5 h-5 text-gray-500" />
                            </div>

                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                <feature.icon className="w-6 h-6" strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl font-light text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                                {feature.title}
                            </h3>

                            <p className="text-gray-500 font-light leading-relaxed group-hover:text-gray-400 transition-colors">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-32 relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-12 text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-light text-white mb-6">
                            Ready to upgrade your workflow?
                        </h3>
                        <button className="px-8 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                            Start Building Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
