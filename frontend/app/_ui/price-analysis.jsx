import { useEffect } from "react";
import { getPriceAnalysis } from "@/_lib/analysis";
import { useActionState } from "react";

/**
 * PriceAnalysis component
 *
 * Renders a form to analyze item prices. Submits item name to a server function
 * and displays analysis once complete.
 *
 * @returns {JSX.Element} The rendered component
 */
export default function PriceAnalysis() {
  const [state, action, pending] = useActionState(getPriceAnalysis, undefined);

  /**
   * useEffect to perform cleanup or handle state change when analysis is complete
   */
  useEffect(() => {
    if (state?.success) {
      return () => console.log("Price Analysis Got"); // Cleanup logic if component unmounts
    }
  }, [state]);

  return (
    <div>
      {/* Form to submit item name for price analysis */}
      <form action={action}>
        <div>
          <label className="" htmlFor="itemName">
            Item Name:
          </label>
          <input
            className=""
            id="itemName"
            name="itemName"
            type="text"
            required
          />
        </div>

        {/* Submit button */}
        <div>
          <button
            className=""
            disabled={pending}
            type="submit"
          >
            {pending ? "Analyzing..." : "Get Price Analysis"}
          </button>
        </div>
      </form>
    </div>
  );
}
