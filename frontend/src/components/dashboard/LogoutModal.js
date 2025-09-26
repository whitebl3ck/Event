import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function LogoutModal({ open, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute left-1/2 transform -translate-x-1/2 top-0 mt-0 bg-white shadow-xl p-8 w-96 text-center rounded-b-2xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Confirm Logout</h2>
            <p className="mb-8 text-blue-700">Are you sure you want to logout of the app?</p>
            <div className="flex justify-center gap-6">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                onClick={onConfirm}
              >
                Yes
              </button>
              <button
                className="bg-gray-200 text-blue-900 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default LogoutModal;