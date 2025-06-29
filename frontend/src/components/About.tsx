
const About = () => {
  const services = [
    {
      title: "iOS Development",
      description: "Native iOS apps built with Swift and React Native for premium user experiences.",
      icon: "📱"
    },
    {
      title: "Shopify Development",
      description: "Custom Shopify stores and apps designed to maximize conversions and sales.",
      icon: "🛒"
    },
    {
      title: "React Native Apps",
      description: "Cross-platform mobile applications with native performance and feel.",
      icon: "⚛️"
    },
    {
      title: "Web Development",
      description: "Custom websites built with cutting-edge technology and optimized for performance.",
      icon: "🌐"
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Crafting Digital Excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At Thinkra, we specialize in iOS, Shopify, and React Native development for elite clients. 
            Our team combines strategic thinking with world-class execution to deliver results that exceed expectations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold text-black mb-6">Our Expertise</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              We specialize in <strong>iOS development</strong>, <strong>Shopify e-commerce</strong>, 
              and <strong>React Native</strong> mobile applications. Our selective approach allows us to 
              focus on technologies that deliver exceptional results for high-profile clients.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              From custom iOS apps for athletes to high-converting Shopify stores for luxury brands, 
              we create digital experiences that set new industry standards.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">📱</div>
                <div>
                  <div className="font-semibold text-black">iOS Specialists</div>
                  <div className="text-gray-600">Native & React Native expertise</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">🛒</div>
                <div>
                  <div className="font-semibold text-black">Shopify Partners</div>
                  <div className="text-gray-600">E-commerce conversion experts</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">⚛️</div>
                <div>
                  <div className="font-semibold text-black">React Native Masters</div>
                  <div className="text-gray-600">Cross-platform mobile solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h4 className="text-xl font-bold text-black mb-3">{service.title}</h4>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
