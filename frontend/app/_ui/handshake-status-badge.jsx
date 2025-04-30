/**
 * HandshakeStatusBadge component
 *
 * This component renders a badge based on the provided handshake status. 
 * It sanitizes the status (converts to lowercase) and checks it against predefined 
 * status values to render an appropriate badge with a specific background color 
 * and label. If the status is unrecognized, it will display a neutral badge 
 * with the raw status name.
 *
 * @param {Object} props - The component props
 * @param {string} props.status - The status of the handshake (e.g., "completed", "pending", etc.)
 * @returns {JSX.Element} A badge indicating the current handshake status.
 */
export default function HandshakeStatusBadge({ status }) {
  const sanitizedStatus = status.toLowerCase(); // Normalize with fallback

  const STATUS_BADGE = {
    completed: (
      <span className="bg-hs-completed text-xs text-white text-center py-1 px-3 rounded-full uppercase">
        Completed
      </span>
    ),
    created: (
      <span className="bg-primary text-xs text-white text-center py-1 px-3 rounded-full uppercase">
        Created
      </span>
    ),
    accepted: (
      <span className="bg-primary-dark text-xs text-white text-center py-1 px-3 rounded-full uppercase">
        Accepted
      </span>
    ),
    failed: (
      <span className="bg-hs-failed text-xs text-white text-center py-1 px-3 rounded-full uppercase">
        Failed
      </span>
    ),
    cancelled: (
      <span className="bg-hs-failed text-xs text-white text-center py-1 px-3 rounded-full uppercase">
        Cancelled
      </span>
    ),
    pending: (
      <span className="bg-hs-pending text-xs text-white text-center py-1 px-3 rounded-full uppercase">
        Pending
      </span>
    ),
  }[sanitizedStatus] ?? (
    <span className="bg-neutral text-xs text-white text-center py-1 px-3 rounded-full uppercase">
      {sanitizedStatus}
    </span>
  );

  return <div>{STATUS_BADGE}</div>;
}
