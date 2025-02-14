import { motion } from 'framer-motion';
const Home = () => {
  return (
    <div style={{marginLeft:'15px'}}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-lg shadow-sm mb-6"
      >
        <h1 >Welcome Back!</h1>
        <p>Here's what's happening with your chatbot today</p>
      </motion.div>
    </div>
  );
};

export default Home;