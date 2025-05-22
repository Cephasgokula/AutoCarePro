import React from 'react';
import Layout from '../components/Layout/Layout';
import Hero from '../components/Home/Hero';
import ServiceCategories from '../components/Home/ServiceCategories';
import HowItWorks from '../components/Home/HowItWorks';
import Testimonials from '../components/Home/Testimonials';
import CTASection from '../components/Home/CTASection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <ServiceCategories />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default HomePage;