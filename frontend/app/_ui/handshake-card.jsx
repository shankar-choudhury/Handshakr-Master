import HandshakeStatusBadge from './handshake-status-badge';

/**
 * HandshakeCard component
 *
 * This component renders a card displaying details about a handshake:
 * - Handshake name
 * - Status with a badge
 * - Signed and completed dates
 * - Initiator and acceptor usernames
 * - Encrypted handshake details
 *
 * The card dynamically adjusts its appearance based on the status of the handshake.
 * The status is color-coded, and the details section includes encrypted data.
 *
 * @param {Object} props - The props for this component.
 * @param {string} props.handshakeName - The name of the handshake.
 * @param {string} props.encryptedDetails - The encrypted details of the handshake.
 * @param {string} props.signedDate - The date the handshake was signed.
 * @param {string} props.completedDate - The date the handshake was completed.
 * @param {string} props.handshakeStatus - The current status of the handshake.
 * @param {string} props.initiatorUsername - The username of the initiator of the handshake.
 * @param {string} props.acceptorUsername - The username of the acceptor of the handshake.
 *
 * @returns {JSX.Element} A card displaying all the handshake details.
 */


export default function HandshakeCard({
  handshakeName,
  encryptedDetails,
  signedDate,
  completedDate,
  handshakeStatus,
  initiatorUsername,
  acceptorUsername
}) {
  const sanitizedStatus = handshakeStatus.toLowerCase();
  
  const STATUS_BG_STYLE = {
    completed: "bg-hs-completed/50",
    created: "bg-primary-dark",
    accepted: "bg-primary",
    failed: "bg-hs-failed/50",
    cancelled: "bg-hs-failed/50",
    pending: "bg-hs-pending/75",
  }[sanitizedStatus] || "bg-neutral";

  return (
    <div className="mb-10 w-full max-w-md rounded-lg shadow-md">
      {/* Header */}
      <div className={`px-6 py-2 rounded-t-lg ${STATUS_BG_STYLE}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-lg text-white font-semibold">
            {handshakeName}
          </h1>
          <HandshakeStatusBadge status={sanitizedStatus} />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 bg-white rounded-b-lg space-y-4">
        {/* Dates */}
        <div className="space-y-1">
          <h2 className="font-medium">
            <span className="text-neutral font-bold">Signed Date:</span>{" "}
            {signedDate}
          </h2>
          <h2 className="font-medium">
            <span className="text-neutral font-bold">Completed Date:</span>{" "}
            {completedDate ? completedDate : <span className="text-warning">NOT COMPLETED</span>}
          </h2>
        </div>

        {/* Parties */}
        <div className="space-y-1">
          <h2 className="font-medium">
            <span className="text-neutral font-bold">Initiated by:</span>{" "}
            {initiatorUsername}
          </h2>
          <h2 className="font-medium">
            <span className="text-neutral font-bold">For:</span>{" "}
            {acceptorUsername}
          </h2>
        </div>

        {/* Terms */}
        <div className="pt-2">
          <h2 className="text-neutral font-bold ">
            Details:
          </h2>
          <p className='break-words whitespace-pre-line overflow-hidden'>{encryptedDetails}</p>
        </div>
      </div>
    </div>
  );
}
