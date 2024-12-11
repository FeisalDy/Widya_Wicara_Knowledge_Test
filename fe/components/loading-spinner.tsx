import React from 'react'
import { cn } from '@/lib/utils' // Assuming 'cn' is a utility for conditional classnames.

type LoadingSpinnerPropsT = {
  size?: number
  width?: number
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerPropsT> = ({
  size = 24,
  width = 2,
  className
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={width}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('animate-spin', className)}
    >
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  )
}
