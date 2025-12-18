import React from 'react';

const Info = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      <p className="mt-1 text-slate-500 text-sm">{subtitle}</p>
    </div>
  );
};

export default Info;
