import {memo} from "react";


const ResuableHeader = memo(({ title }: {title: string}) => {
  return (
    <h2 className="text-3xl font-bold text-shadow-amber-500">
      {title}
      <span className="flex items-center mt-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300"></span>


        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300"></span>
      </span>
    </h2>
  );
});

export default ResuableHeader