import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContactFormMutation } from "@/store/api/contactApi";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        projectType: "",
        budget: "",
        message: "",
    });
    const { toast } = useToast();
    const [submitContactForm, { isLoading }] = useSubmitContactFormMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await submitContactForm(formData).unwrap();

            if (response.success) {
                toast({
                    title: "Thank you for your inquiry!",
                    description: "We'll get back to you within 24 hours to discuss your project.",
                });
                setFormData({
                    name: "",
                    email: "",
                    company: "",
                    projectType: "",
                    budget: "",
                    message: "",
                });
            }
        } catch (error: any) {
            toast({
                title: "Submission Failed",
                description:
                    error?.data?.message || "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <section id="contact" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                            Let's Create Something Extraordinary
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Ready to elevate your digital presence? We're here to turn your vision
                            into reality with our world-class development and design expertise.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-lg">📞</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-black">Direct Line</h4>
                                    <p className="text-gray-600">3055102017</p>
                                    <p className="text-sm text-gray-500">
                                        Available 24/7 for premium clients
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-lg">✉️</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-black">Email</h4>
                                    <p className="text-gray-600">hello@thinkra.com</p>
                                    <p className="text-sm text-gray-500">
                                        We respond within 2 hours
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-lg">🏢</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-black">Office</h4>
                                    <p className="text-gray-600">Miami, CA</p>
                                    <p className="text-sm text-gray-500">By appointment only</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
                            <h4 className="font-bold text-black mb-3">What to Expect</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-black rounded-full"></span>
                                    <span>Initial consultation within 24 hours</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-black rounded-full"></span>
                                    <span>Detailed project proposal within 3 days</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-black rounded-full"></span>
                                    <span>Dedicated project manager assigned</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-black rounded-full"></span>
                                    <span>Regular updates and milestone reviews</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold text-black mb-6">Start Your Project</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="bloc text-sm font-medium text-gray-700 mb-2">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                                    placeholder="Your company name"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Type *
                                    </label>
                                    <select
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors">
                                        <option value="">Select project type</option>
                                        <option value="website">Website Development</option>
                                        <option value="mobile">Mobile Application</option>
                                        <option value="ecommerce">E-commerce Platform</option>
                                        <option value="branding">Brand Identity</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Budget Range
                                    </label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors">
                                        <option value="">Select budget range</option>
                                        <option value="800-1k">$800 - $1K</option>
                                        <option value="1k-3500">$1K - $3,500</option>
                                        <option value="3500-20000">$3,500 - $20,000</option>
                                        <option value="20000-50000">$20,000 - $50,000</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Details *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors resize-none"
                                    placeholder="Tell us about your project, goals, and timeline..."
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black hover:bg-gray-800 text-white py-4 text-lg rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? "Sending..." : "Send Project Inquiry"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
