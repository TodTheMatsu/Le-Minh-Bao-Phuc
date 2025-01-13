import React from 'react';
import { motion } from 'framer-motion';

const spinnerVariants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

const Spinner = () => {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className='w-screen absolute bg-black bg-opacity-75 z-10 h-screen flex items-center justify-center'>

    <motion.svg 
    className="animate-spin absolute w-auto h-48 fill-none stroke-white" viewBox="0 0 48 48"  xmlns="http://www.w3.org/2000/svg"> 
    <path d="M4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4" />
    </motion.svg>
    </motion.div>
  );
};

export default Spinner;