'use client'

import { useActionState } from 'react'
import { createHandshake } from '@/_lib/handshakeService'

/**
 * HandshakeCreationForm component
 *
 * This component renders a form that allows the user to create a new handshake.
 * It collects the following information:
 * - Handshake Name
 * - Receiver Username
 * - Encrypted Details
 *
 * It uses the `useActionState` hook to handle form submission, errors, success, and pending states.
 * The form includes validation and displays messages for both errors and successful submissions.
 *
 * @returns {JSX.Element} The form for creating a handshake with error and success handling.
 */

export default function HandshakeCreationForm() {
  const [state, action, pending] = useActionState(createHandshake, undefined)

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
      <form
        action={action}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Enter Handshake Details:</h2>

        <div className="mb-4">
          <label
            className="block text-sm font-medium  mb-2"
            htmlFor="handshakeName">
            Handshake Name
          </label>
          <input
            id="handshakeName"
            name="handshakeName"
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        {state?.errors?.handshakeName && (
          <p className="text-warning italic mt-1">{state.errors.handshakeName}</p>
        )}
        <div className="mb-4">
          <label
            className="block text-sm font-medium  mb-2"
            htmlFor="receiverUsername">
            Receiver Username
          </label>
          <input
            id="receiverUsername"
            name="receiverUsername"
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        {state?.errors?.receiverUsername && (
          <p className="text-warning italic mt-1">
            {state.errors.receiverUsername}
          </p>
        )}

        <div className="mb-6">
          <label
            className="block text-sm font-medium  mb-2"
            htmlFor="encryptedDetails">
            Details
          </label>
          <textarea
            id="encryptedDetails"
            name="encryptedDetails"
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        {state?.errors?.encryptedDetails && (
          <p className="text-warning italic mt-1">{state.errors.encryptedDetails}</p>
        )}

        <button
          className="w-full bg-primary text-white py-4 px-4 font-bold text-sm rounded cursor-pointer focus:outline-none focus:shadow-outline hover:bg-primary-dark"
          disabled={pending}
          type="submit"
        >
          {pending ? 'Creating Handshake...' : 'Create Handshake'}
        </button>

        {/* sucess message */}
        {state?.success && (
          <p className="text-success text-center font-semibold my-3">
            Handshake created successfully!
          </p>
        )}

        {/* error message */}
        {state?.message && !state.success && (
          <p className="text-warning text-center font-semibold my-3">
            {state.message}
          </p>
        )}
      </form>
    </div>
  )
}
