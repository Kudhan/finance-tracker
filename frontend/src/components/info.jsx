const Info = ({ title, subtitle }) => {
  return (
    <div className="mb-8 px-4 sm:px-8 md:px-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 ">{title}</h1>
      <p className="mt-2 text-gray-600  text-sm sm:text-base">{subtitle}</p>
    </div>
  );
};

export default Info;
