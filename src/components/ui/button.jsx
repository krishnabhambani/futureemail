export function Button({ 
  variant = 'default',
  className = '',
  ...props 
}) {
  const baseStyles = 'px-4 py-2 rounded-md transition-colors';
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border hover:bg-secondary',
    ghost: 'hover:bg-secondary',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}