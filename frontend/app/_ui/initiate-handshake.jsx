/**
 * InitiateHandshake component
 *
 * This component allows users to initiate a new handshake. If the user clicks the 
 * "Initiate New Handshake" button, it reveals a form (`HandshakeCreationForm`) for creating a handshake. 
 * The form also includes a cancel button to hide the form and go back to the initial state.
 *
 * @returns {JSX.Element} The component renders a button to initiate a new handshake or 
 * the handshake creation form along with a cancel button.
 */
import { useState } from "react";
import HandshakeCreationForm from "../ui/handshake-creation-form";

export default function InitiateHandshake() {
  const [showHandshakeForm, setShowHandshakeForm] = useState(false);

  return (
    <div className="m-auto">
      {!showHandshakeForm ? (
        <button
          onClick={() => setShowHandshakeForm(true)}
          className="bg-primary text-neutral px-4 py-2 rounded-md mt-4"
        >
          Initiate New Handshake
        </button>
      ) : (
        <div>
          <HandshakeCreationForm />
          <button
            onClick={() => setShowHandshakeForm(false)} // Cancel button
            className="bg-gray-500 text-neutral px-4 py-2 rounded-md mt-4"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
