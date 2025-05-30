import React from "react";

const Title = ({ title }) => {
  return (
    <p className='text-2xl 2xl:text-3xl font-semibold text-gray-600 mt-1 mb-1'>
      {title}
    </p>
  );
};

export default Title;