import React, { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'

export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
)

export const Label: React.FC<LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className, ...props }) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
)

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>
)

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
)

export const CardTitle: React.FC<CardProps> = ({ children, className }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
)

export const CardDescription: React.FC<CardProps> = ({ children, className }) => (
  <p className={`mt-1 text-sm text-gray-600 ${className}`}>{children}</p>
)

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

export const CardFooter: React.FC<CardProps> = ({ children, className }) => (
  <div className={`px-6 py-4 bg-gray-50 ${className}`}>{children}</div>
)

export const Alert: React.FC<CardProps & { variant?: 'default' | 'destructive' }> = ({ children, className, variant = 'default' }) => (
  <div className={`p-4 rounded-md ${variant === 'destructive' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'} ${className}`}>
    {children}
  </div>
)

export const AlertDescription: React.FC<CardProps> = ({ children, className }) => (
  <p className={`text-sm ${className}`}>{children}</p>
)

export const IconButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & { icon: ReactNode }> = ({ children, className, icon, ...props }) => (
  <button
    className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    {...props}
  >
    {icon}
    <span className="ml-2">{children}</span>
  </button>
)

export const Divider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white text-gray-500">{children}</span>
    </div>
  </div>
)

