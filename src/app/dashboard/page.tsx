const page = () => {
  return (
    <>
      <div className="flex justify-between bg-blue-300">
        <div className="text-blue-500 hover:text-blue-800 p-3">User Name</div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 my-1 mx-3 rounded">
          Sign Out
        </button>
      </div>
    </>
  );
};

export default page;
