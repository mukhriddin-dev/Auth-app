import classes from './LoadingBounce.module.css';

const LoadingBounce = () => {
  return (
    <div
      className={`${classes.loader} "bg-white p-5 rounded-full flex space-x-3"`}
    >
      <div className="w-5 h-5 bg-gray-800 rounded-full animate-bounce"></div>
      <div className="w-5 h-5 bg-gray-800 rounded-full animate-bounce"></div>
      <div className="w-5 h-5 bg-gray-800 rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingBounce;
