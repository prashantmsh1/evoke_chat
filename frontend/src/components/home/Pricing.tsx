import React from "react";
import { Check } from "lucide-react";

const Pricing: React.FC = () => {
    const plans = [
        {
            name: "Hobby",
            price: 5,
            description: "Perfect for personal use",
            features: ["1,200 messages", "Pro LLM access", "Unlimited web search", "Basic support"],
        },
        {
            name: "Professional",
            price: 15,
            description: "Best for professionals",
            features: [
                "4,000 messages",
                "Priority LLM access",
                "Unlimited web search",
                "Priority support",
                "Advanced analytics",
            ],
            popular: true,
        },
        {
            name: "Enterprise",
            price: 50,
            description: "For teams and organizations",
            features: [
                "15,000 messages",
                "Dedicated LLM instances",
                "Unlimited web search",
                "24/7 premium support",
                "Custom API access",
                "Team collaboration tools",
            ],
        },
    ];

    return (
        <section className="py-32 px-6 lg:px-12 bg-gradient-to-br from-[#1C1C1C] via-[#2A2A2A] to-[#404040]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-24">
                    <h2 className="text-3xl lg:text-4xl font-extralight mb-6 text-white tracking-tight">
                        Choose Your Plan
                    </h2>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-8"></div>
                    <p className="text-lg font-light text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Flexible pricing designed to scale with your needs. All plans include our
                        core AI features.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-12 border transition-all duration-300 backdrop-blur-sm ${
                                plan.popular
                                    ? "border-white/30 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10"
                                    : "border-white/20 bg-gradient-to-br from-white/5 to-transparent hover:border-white/30 hover:from-white/10 hover:to-white/5"
                            }`}>
                            {plan.popular && (
                                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
                            )}

                            <div className="text-center mb-12">
                                <h3 className="text-xl font-light text-white mb-2 tracking-wide">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-400 font-light text-sm mb-8">
                                    {plan.description}
                                </p>

                                <div className="mb-8">
                                    <span className="text-4xl font-extralight text-white">
                                        ${plan.price}
                                    </span>
                                    <span className="text-gray-400 font-light ml-2">/month</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-12">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start space-x-3">
                                        <Check
                                            className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0"
                                            strokeWidth={1.5}
                                        />
                                        <span className="text-gray-300 font-light text-sm leading-relaxed">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 text-sm font-light tracking-wide transition-all duration-300 ${
                                    plan.popular
                                        ? "bg-white text-black hover:bg-gray-100 shadow-lg"
                                        : "border border-white/20 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm text-gray-300 hover:text-white hover:border-white/30 hover:from-white/10"
                                }`}>
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="text-center mt-16">
                    <p className="text-gray-400 font-light mb-6">
                        All plans include a 14-day free trial. No credit card required.
                    </p>
                    <div className="flex justify-center space-x-8 text-xs font-light text-gray-500">
                        <span>Cancel anytime</span>
                        <span>30-day money back</span>
                        <span>Enterprise support available</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
