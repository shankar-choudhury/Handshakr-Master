export default function HandshakeAnalyticsCard({ count, status }) {
  const sanitizedStatus = status.toLowerCase();
  const statusHeader = status.toUpperCase();
  // Define background styles based on the status
  const STATUS_BG_STYLE = {
    completed: "bg-hs-completed/50",
    failed: "bg-hs-failed/50",
    pending: "bg-hs-pending/50",
  }[sanitizedStatus] || "bg-neutral"; // Default to gray if no match

  return (

    //**** START DESIGN 1 */

    // <div className="flex flex-row rounded-lg shadow-md">
    //   <div className={`${STATUS_BG_STYLE} flex-1 flex items-center justify-center`}>
    //     <div className="text-lg font-bold p-2">
    //       <p className="capitalize">{status}</p>
    //     </div>
    //   </div>
    //   <div className="bg-white rounded-lg p-4 text-2xl font-semibold flex items-center justify-center w-[120px]">
    //     <p>{count}</p>
    //   </div>
    // </div>

    //END DESIGN 1

    //START DESIGN 2 
    <div className="mb-10 w-full max-w-md rounded-lg shadow-md">
      {/* Header */}
      <div className={`px-6 py-2 rounded-t-lg ${STATUS_BG_STYLE}`}>
        <h1 className="text-lg text-white font-semibold">
          {statusHeader}
        </h1>
      </div>


      <div className="px-6 py-5 bg-white rounded-b-lg space-y-2">
        {/* COUNT */}
        {count}
      </div>

    </div>
    //END DESIGN 2

  );
}