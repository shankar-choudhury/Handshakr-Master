/**
 * PriceInputForm component
 *
 * Renders a form to input an item's name for price analysis.
 *
 * @param {Object} props - Component props
 * @param {(itemName: string) => void} props.onSubmit - Callback function to handle form submission
 * @param {boolean} props.loading - Indicates whether the form is currently submitting
 *
 * @returns {JSX.Element} Rendered input form for item name
 */
export default function PriceInputForm({ onSubmit, loading }) {
  /**
   * Handles form submission by extracting the item name and calling onSubmit
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  function handleSubmit(e) {
    e.preventDefault();
    const itemName = e.target.itemName.value.trim();
    if (itemName) onSubmit(itemName);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold text-center mt-2 mb-6">Enter Item to analyze</h2>
      <label className="block text-sm font-medium mb-2" htmlFor="itemName">
        Name:
      </label>
      <input
        id="itemName"
        name="itemName"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
      />
      <button
        type="submit"
        className="w-full bg-primary text-white py-4 mt-4 rounded font-bold hover:bg-primary-dark"
        disabled={loading}
      >
        {loading ? 'Getting Analysis...' : 'Get Price Analysis'}
      </button>
    </form>
  );
}
