import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg shadow-black/5"
                    : "bg-white/60 backdrop-blur-md border-b border-white/20"
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
                        <img
                            src="/lovable-uploads/ab3bac13-4fe5-4ac2-a2d5-1f6164b806d9.png"
                            alt="Thinkra"
                            className="h-36 w-auto"
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-1">
                            {[
                                { label: "Home", id: "hero" },
                                { label: "About", id: "about" },
                                { label: "Portfolio", id: "portfolio" },
                                { label: "Contact", id: "contact" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="relative px-4 py-2 text-gray-700 hover:text-black transition-all duration-300 font-medium text-sm group">
                                    <span className="relative z-10">{item.label}</span>
                                    <div className="absolute inset-0 bg-black/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Button
                            onClick={() => scrollToSection("contact")}
                            className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-black/20">
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative p-2 text-gray-600 hover:text-black transition-colors duration-300 focus:outline-none">
                            <div className="w-6 h-6 relative">
                                <span
                                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                                        isOpen ? "rotate-45 top-3" : "top-1"
                                    }`}></span>
                                <span
                                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 top-3 ${
                                        isOpen ? "opacity-0" : "opacity-100"
                                    }`}></span>
                                <span
                                    className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                                        isOpen ? "-rotate-45 top-3" : "top-5"
                                    }`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}>
                <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
                    <div className="px-4 py-6 space-y-4">
                        {[
                            { label: "Home", id: "hero" },
                            { label: "About", id: "about" },
                            { label: "Portfolio", id: "portfolio" },
                            { label: "Contact", id: "contact" },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="block w-full text-left px-4 py-3 text-gray-700 hover:text-black hover:bg-black/5 rounded-lg transition-all duration-300 font-medium">
                                {item.label}
                            </button>
                        ))}
                        <div className="pt-4 border-t border-gray-200/50">
                            <Button
                                onClick={() => scrollToSection("contact")}
                                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-sm font-medium rounded-lg transition-all duration-300">
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile menu */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                    style={{ top: "5rem" }}></div>
            )}
        </nav>
    );
};

export default Navigation;
