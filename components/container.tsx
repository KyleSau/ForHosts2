import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="relative mx-auto px-8 w-full max-w-7xl">
      {children}
    </div>
  );
};

export default Container;
