import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti'; 
import { CheckCircleIcon, HomeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import { Button } from '../components/common/Button';
import { PageLayout } from '../components/layout/PageLayout';
import { GlassCard } from '../components/common/GlassCard';

export const SucessPage = () => { 
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PageLayout center={true}>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.3}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
          className="mb-8"
        >
          <CheckCircleIcon className="w-32 h-32 mx-auto text-green-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink"
        >
          Order Placed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-brand-gray mb-8"
        >
          Thank you for your order! We'll send you a confirmation email with tracking details shortly.
        </motion.p>

        <GlassCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-2xl mb-8" 
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <BuildingStorefrontIcon className="w-6 h-6 text-brand-purple" />
            <span className="font-semibold text-lg text-gray-800">Order Number</span>
          </div>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink"
          >
            #ORD-{Math.floor(Math.random() * 10000).toString().padStart(4, "0")}
          </motion.p>
        </GlassCard>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-4"
        >
            <Button as="Link" to="/" variant="primary">
              <HomeIcon className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
            
            <Button variant="secondary" disabled>
              Track Order (Not Implemented)
            </Button>
        </motion.div>
      </motion.div>
    </PageLayout >
  );
};

export default SucessPage;