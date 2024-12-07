import React from "react";
import Header from "./Header";
import Title from "../shared/Title";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    return (
      <div>
        <Title />
        <Header />
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default AppLayout;
