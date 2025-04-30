/**
 * PriceStatsCard component
 *
 * Displays recent sale price statistics (mean, median, max, and min) for a given item.
 *
 * @param {Object} props - Component props
 * @param {string} props.itemName - Name of the item being analyzed
 * @param {number} props.max - Maximum sale price
 * @param {number} props.mean - Average sale price
 * @param {number} props.median - Median sale price
 * @param {number} props.min - Minimum sale price
 *
 * @returns {JSX.Element} Rendered price statistics card
 */
export default function PriceStatsCard({ itemName, max, mean, median, min }) {
  return (
    <div className="bg-white p-6 text-sm rounded-lg shadow-md w-full max-w-md mx-auto">
      <div>
        <h2 className="text-lg font-bold mb-4 text-center capitalize">
          <span className="italic text-primary">{itemName}</span> recent sale price stats
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Average:</span>
            <span className="text-primary font-bold">{Number(mean).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Median:</span>
            <span className="text-primary font-bold">{Number(median).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Highest:</span>
            <span className="text-primary font-bold">{Number(max).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Lowest:</span>
            <span className="text-primary font-bold">{Number(min).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
