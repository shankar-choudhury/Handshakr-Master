/**
 * PriceGraphs component
 *
 * Renders price analysis graphs including a histogram and a median weekly prices chart.
 *
 * @param {Object} props - Component props
 * @param {string} [props.histogramUrl] - URL for the histogram image
 * @param {string} [props.medianGraphUrl] - URL for the median weekly prices image
 *
 * @returns {JSX.Element} Rendered image elements or null if no URLs provided
 */
export default function PriceGraphs({ histogramUrl, medianGraphUrl }) {
  if (!histogramUrl && !medianGraphUrl) return null;

  return (
    <div className="mt-6 flex flex-col gap-4">
      {histogramUrl && (
        <img src={histogramUrl} alt="Price Histogram" className="rounded shadow" />
      )}
      {medianGraphUrl && (
        <img src={medianGraphUrl} alt="Median Weekly Prices" className="rounded shadow" />
      )}
    </div>
  );
}
