import React from "react";
import { Brain, Mail, Shield, FileText } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-white/10 bg-gradient-to-t from-[#404040] via-[#2A2A2A] to-[#1C1C1C]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-8">
                            <Brain className="w-6 h-6 text-white" strokeWidth={1.5} />
                            <span className="text-lg font-light tracking-wide text-white">
                                Evoke AI
                            </span>
                        </div>
                        <p className="text-gray-400 font-light leading-relaxed mb-8 max-w-sm">
                            The most advanced AI chat platform with unlimited web search and Pro LLM
                            access.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-white font-light mb-6 tracking-wide">Product</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 font-light hover:text-gray-300 transition-colors text-sm">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 font-light hover:text-gray-300 transition-colors text-sm">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 font-light hover:text-gray-300 transition-colors text-sm">
                                    API Access
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 font-light hover:text-gray-300 transition-colors text-sm">
                                    Enterprise
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-light mb-6 tracking-wide">Support</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 font-light hover:text-gray-300 transition-colors text-sm">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 font-light hover:text-gray-300 transition-colors text-sm">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 font-light hover:text-gray-300 transition-colors text-sm">
                                    Status Page
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 font-light hover:text-gray-300 transition-colors text-sm">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-light mb-6 tracking-wide">Stay Updated</h3>
                        <p className="text-gray-400 font-light mb-6 text-sm leading-relaxed">
                            Get the latest updates on new features and AI advancements.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-sm font-light"
                            />
                            <button className="w-full px-4 py-3 bg-white text-black text-sm font-light tracking-wide hover:bg-gray-100 transition-colors shadow-lg">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-20 pt-8 border-t border-white/10">
                    <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
                        {/* Trust Badges */}
                        <div className="flex items-center space-x-8 text-xs font-light text-gray-500">
                            <div className="flex items-center space-x-2">
                                <Shield className="w-3 h-3" strokeWidth={1.5} />
                                <span>SOC 2 Compliant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Shield className="w-3 h-3" strokeWidth={1.5} />
                                <span>GDPR Ready</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Shield className="w-3 h-3" strokeWidth={1.5} />
                                <span>256-bit Encryption</span>
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className="flex space-x-8 text-xs font-light text-gray-500">
                            <a
                                href="#"
                                className="flex items-center space-x-1 hover:text-gray-400 transition-colors">
                                <FileText className="w-3 h-3" strokeWidth={1.5} />
                                <span>Privacy Policy</span>
                            </a>
                            <a
                                href="#"
                                className="flex items-center space-x-1 hover:text-gray-400 transition-colors">
                                <FileText className="w-3 h-3" strokeWidth={1.5} />
                                <span>Terms of Service</span>
                            </a>
                        </div>
                    </div>

                    <div className="text-center mt-8 text-gray-500 text-xs font-light">
                        © 2025 Evoke AI. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
