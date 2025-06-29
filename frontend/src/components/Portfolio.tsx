
import FeaturedProjects from './portfolio/FeaturedProjects';
import RecentProjects from './portfolio/RecentProjects';
import PortfolioCTA from './portfolio/PortfolioCTA';
import { projects } from './portfolio/projectData';

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-16 sm:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-black/5 rounded-full text-xs sm:text-sm font-medium text-gray-600 mb-4 sm:mb-6">
            Our Work
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black mb-4 sm:mb-8 leading-tight px-4">
            Crafted with{" "}
            <span className="italic font-light">Excellence</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Each project represents our commitment to delivering world-class solutions 
            for discerning clients who demand nothing less than perfection.
          </p>
        </div>

        {/* Featured Projects */}
        <FeaturedProjects projects={projects} />

        {/* Recent Work Grid */}
        <RecentProjects projects={projects} />

        {/* CTA Section */}
        <PortfolioCTA />
      </div>
    </section>
  );
};

export default Portfolio;
