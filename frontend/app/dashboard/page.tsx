'use client';

import { useEffect, useState } from 'react';
import ProfileCard from '@/_ui/profile-card';
import PageHeader from '@/_ui/page-header';
import { fetchUserProfile } from '@/_lib/userDataAccess';
import { UserData } from '@/_lib/definitions';
import { userAuthRedirect } from '@/_lib/userAuthService';

/**
 * Dashboard component that displays the user's profile information.
 * 
 * It fetches the user's profile data when the component is mounted and displays it on the page.
 * It also handles loading and error states.
 * 
 * @returns The dashboard page with the user's profile data or an error message.
 */
export default function Dashboard() {

    //auth check
    userAuthRedirect();

  const [userData, setUserData] = useState<UserData | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const res = await fetchUserProfile();
        if (res.success) {
          const user = res.data.data;
          setUserData(user);
        } else {
          setError(res.error || 'Failed to load profile');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);
  
  // data loading message
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <PageHeader title="Dashboard" subTitle="Welcome to Handshakr" />
        <p>Loading profile...</p>
      </div>
    );
  }

  // error message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <PageHeader title="Dashboard" subTitle="Welcome to Handshakr" />
        <p className="text-warning font-bold">Error: {error}</p>
      </div>
    );
  }

  // display profile info
  return (
    <div className="flex flex-col items-center justify-top min-h-screen">
      <PageHeader title="Dashboard" subTitle="Welcome to Handshakr" />
      <div className="flex flex-col gap-2">
        {userData && (
          <ProfileCard
            username={userData.username}
            userId={userData.id}
            email={userData.email}
          />
        )}
      </div>
    </div>
  );
}
