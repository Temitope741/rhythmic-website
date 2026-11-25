import React from 'react';
import Hero from '../components/Hero';
import RecentWork from '../components/RecentWork';
// import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <RecentWork />
      {/* <Testimonials /> */}
      <Contact />
    </>
  );
};

export default Home;