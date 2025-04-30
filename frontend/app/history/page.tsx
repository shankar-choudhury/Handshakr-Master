'use client';

import { useEffect, useState } from 'react';
import { fetchInitiatedHandshakes, fetchReceivedHandshakes, fetchUserProfile } from "@/_lib/userDataAccess";
import HandshakeCard from "@/_ui/handshake-card";
import PageHeader from "@/_ui/page-header";
import { Handshake } from '@/_lib/definitions';
import { userAuthRedirect } from '@/_lib/userAuthService';

/**
 * Page component that displays a user's handshake history, including both initiated and received handshakes.
 * 
 * This component fetches the user's profile, and then fetches both initiated and received handshakes 
 * from the backend. The handshakes are merged and sorted by the signed date in descending order before 
 * being displayed in individual `HandshakeCard` components.
 * 
 * @returns A page displaying a list of handshakes (both initiated and received) with their details.
 */
export default function Page() {

    //auth check
    userAuthRedirect();

  /** List of all handshakes for the logged-in user */
  const [handshakes, setHandshakes] = useState<Handshake[]>([]);

  /** Whether data is being loaded */
  const [loading, setLoading] = useState(true);
  
   /** Holds any error message encountered during data fetching */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches both initiated and received handshakes for the current user and sets them to the state.
     * This function is invoked once the component mounts.
     */
    const loadHandshakes = async () => {
      try {
        // Fetch user profile
        const userRes = await fetchUserProfile();
        if (!userRes.success) {
          setError(userRes.error || "Failed to load profile");
          return;
        }

        const username = userRes.data.data.username;

        if (!username) {
          setError("Failed to get user profile");
          return;
        }

        // Fetch initiated and received handshakes concurrently
        const [initiated, received] = await Promise.all([
          fetchInitiatedHandshakes(username),
          fetchReceivedHandshakes(username),
        ]);

        // Merge and sort handshakes
        const initiatedData = initiated.success ? initiated.data : [];
        const receivedData = received.success ? received.data : [];

        setHandshakes(
          [...initiatedData, ...receivedData].sort((a, b) => 
            new Date(b.signedDate).getTime() - new Date(a.signedDate).getTime()
          )
        );

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadHandshakes();
  }, []);

  return (
    <div className="flex flex-col items-center justify-top min-h-screen">
      <PageHeader
        title="Handshakes History"
        subTitle="All handshakes initiated and received"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-warning">{error}</p>}
      {handshakes.map((handshake) => (
        <HandshakeCard
          key={`${handshake.handshakeName}-${handshake.signedDate}`}
          {...handshake}
        />
      ))}
    </div>
  );
}
