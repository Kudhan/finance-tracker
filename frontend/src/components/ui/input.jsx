import React, { forwardRef } from 'react';
import clsx from 'clsx';

const sizeClasses = {
  default: 'h-10 px-3 py-2',
  sm: 'h-9 px-3 py-1',
  lg: 'h-11 px-4 py-3',
};

const Input = forwardRef(
  (
    { id, label, error, size = 'default', className, rightIcon: RightIcon, onRightIconClick, type = 'text', ...props },
    ref
  ) => (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={type}
          className={clsx(
            'block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50',
            'placeholder-gray-400',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            sizeClasses[size],
            className,
            RightIcon && 'pr-10' // Add padding if there's an icon
          )}
          {...props}
        />

        {RightIcon && (
          <div
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
            title="Toggle password visibility"
          >
            <RightIcon className="text-xl" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
);

Input.displayName = 'Input';

export default Input;
