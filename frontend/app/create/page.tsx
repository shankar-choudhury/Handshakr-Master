'use client'

import HandshakeCreationForm from '@/_ui/handshake-creation-form';
import PageHeader from '@/_ui/page-header';
import { userAuthRedirect } from '@/_lib/userAuthService';
/**
 * Page component for creating a new handshake.
 *
 * This component renders the page layout that includes a header and
 * a form to initiate a new handshake.
 *
 */

export default function Page() {

    //auth check
    userAuthRedirect();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <PageHeader
        title="Create Handshake"
        subTitle="Create and initiate a new handshake"
      />
      <HandshakeCreationForm />
    </div>
  );
}
  