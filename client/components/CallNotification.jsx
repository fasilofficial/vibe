const CallNotification = ({ name, declineCall, answerCall }) => {
  return (
    <div className="fixed z-20 bg-gray-300 p-4 rounded left-1/2 -translate-x-1/2 top-10 min-w-40 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg">{name} is calling...</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={declineCall}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none"
          >
            <span className="font-semibold">Decline</span>
          </button>
          <button
            onClick={answerCall}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none"
          >
            <span className="font-semibold">Answer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
