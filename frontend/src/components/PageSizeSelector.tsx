'use client';

import { motion } from 'framer-motion';

interface PageSizeSelectorProps {
  pageSize: number;
  onChange: (newSize: number) => void;
}

const pageSizeOptions = [5, 10, 20, 50];

export default function PageSizeSelector({ pageSize, onChange }: PageSizeSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">Items per page:</span>
      <motion.select
        value={pageSize}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </motion.select>
    </div>
  );
}