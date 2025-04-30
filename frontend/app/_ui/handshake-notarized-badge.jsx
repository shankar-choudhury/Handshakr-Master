/**
 * NotarizedBadge component
 *
 * This component renders a badge indicating whether an item has been notarized or not.
 * If the `notary` prop is provided, it displays the notary's name in dark text, with 
 * a "Notarized by: <notary>" label. If the `notary` prop is not provided, it displays 
 * "Not notarized" in a warning color.
 *
 * @param {Object} props - The component props
 * @param {string | null} props.notary - The name of the notary, or null if not notarized
 * @returns {JSX.Element} A badge showing the notarization status.
 */
export default function NotarizedBadge({ notary }) {
    return (
        <p className={`font-bold ${notary ? "text-neutral-dark" : "text-warning"}`}>
            {notary ? `Notarized by: ${notary}` : "Not notarized"}
        </p>
    );
}
