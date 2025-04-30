'use client';

import { useEffect, useState } from 'react';
import { fetchInitiatedHandshakes, fetchUserProfile } from "@/_lib/userDataAccess";
import HandshakeCard from "@/_ui/handshake-card";
import PageHeader from "@/_ui/page-header";
import { Handshake } from '@/_lib/definitions';
import { userAuthRedirect } from '@/_lib/userAuthService';
/**
 * Page component to display all handshakes initiated by the current user.
 * 
 * Fetches the user's profile and initiated handshakes on mount. Displays a loading 
 * message while fetching data, an error message if the fetch fails, or a list of 
 * handshakes initiated by the user if the fetch is successful.
 * 
 * @returns A page displaying a list of initiated handshakes with corresponding cards.
 */
export default function Page() {

  //auth check
  userAuthRedirect();
  
/** List of initiated handshakes for the logged-in user */
const [handshakes, setHandshakes] = useState<Handshake[]>([]);
  
  /** Whether data is being loaded */
  const [loading, setLoading] = useState(true);

   /** Holds any error message encountered during data fetching */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
  
      try {
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
  
        const hsRes = await fetchInitiatedHandshakes(username);
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
        title="My Initiated Handshakes"
        subTitle="All Handshakes you have initiated"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-warning">{error}</p>}
      {handshakes.map((handshake) => (
        <HandshakeCard key={handshake.signedDate} {...handshake} />
      ))}
    </div>
  );
}
