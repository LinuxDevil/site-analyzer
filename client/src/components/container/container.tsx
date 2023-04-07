import React from 'react';
import './container.scss';

interface IContainerProps {
    children: React.ReactNode;
}

const Container = ({children}: IContainerProps) => {
    return (
        <div className="container">
            {children}
        </div>
    );
};

export default Container;