import React from 'react';
import clsx from 'clsx';

const variantClasses = {
  default:
    'bg-gray-200 text-gray-800 hover:bg-gray-300',
  outline:
    'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100',
  ghost:
    'bg-gray-100 text-gray-800 hover:bg-gray-200',
  link:
    'bg-transparent text-blue-600 hover:text-blue-800 underline-offset-4',
};

const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

export function Button({
  children, // corrected from 'childer'
  variant = 'default',
  size = 'default',
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
