import React from 'react';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
}

const CustomXIcon = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ color = "currentColor", size = 24, strokeWidth = 2, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* <path d="M18 6 6 18"></path> */}
    </svg>
  )
);

CustomXIcon.displayName = 'CustomXIcon';

export { CustomXIcon }; 