'use client';

import { useEffect, useState } from 'react';
import { fetchReceivedHandshakes, fetchUserProfile } from "@/_lib/userDataAccess";
import HandshakeCard from "@/_ui/handshake-card";
import PageHeader from "@/_ui/page-header";
import { Handshake } from '@/_lib/definitions';
import { userAuthRedirect } from '@/_lib/userAuthService';

/**
 * Received Handshakes Page
 * 
 * Fetches and displays all handshakes received by the current user.
 * Handles loading, error, and empty state UI.
 *
 * @returns A component that renders received handshakes in card format.
 */
export default function Page() {

  //auth check
  userAuthRedirect();

  /** List of received handshakes for the logged-in user */
  const [handshakes, setHandshakes] = useState<Handshake[]>([]);

  /** Whether the handshake data is currently being loaded */
  const [loading, setLoading] = useState(true);

  /** Holds any error messages encountered during data fetching */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches the user profile and received handshakes from the backend.
     * Sets appropriate error or handshake state based on result.
     */
    const loadData = async () => {
      setLoading(true);
  
      try {
        const userRes = await fetchUserProfile();
        if (!userRes.success) {
          setError(userRes.error || "Failed to get user profile");
          return;
        }

        const username = userRes.data.data.username;
        if (!username) {
          setError("No username found error");
          return;
        }

        const hsRes = await fetchReceivedHandshakes(username);
        if (hsRes.success) {
          setHandshakes(hsRes.data);
        } else {
          setError(hsRes.error || "Failed to fetch handshakes.");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-top min-h-screen">
      <PageHeader
        title="My Received Handshakes"
        subTitle="All Handshakes you have received"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-warning">{error}</p>}
      {handshakes.map((handshake) => (
        <HandshakeCard key={handshake.signedDate} {...handshake} />
      ))}
    </div>
  );
}
