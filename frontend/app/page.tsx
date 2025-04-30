import Image from 'next/image';
import LoginForm from "@/_ui/login-form";
import CreateNewAccountButton from "@/_ui/create-new-account-button";

/**
 * Renders the Home page of the application.
 * 
 * Displays a login form and an option to create a new account.
 * Includes branding via a banner image.
 * 
 * @returns The Home page layout component.
 */
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl items-center md:items-start mt-10 gap-8">

        {/* Left side - Image and Text */}
        <div className="flex flex-col justify-start w-full md:w-1/2 p-8">
          <Image
            src="/handshakr-banner.png"
            width={1153}
            height={370}
            alt="handshakr banner"
            className="w-full h-auto mb-6"
          />
          <div>

            <p className="font-bold text-neutral-dark mb-6 text-center md:text-left hyphens-none">
              Handshakr secures and facilitates private agreements. <br></br>Anything from official marketplace interactions <br></br> to casual on-the-fly deals.
            </p>
            <p className=" text-neutral-dark mb-6 text-center md:text-left hyphens-none">
              Download and install the android app to create and validate handshakes wherever you are. 
            </p>

            <a
  href="/handshakr_mobile.apk"
  download
  className="block w-full bg-primary text-white py-4 px-4 font-bold text-sm sm:text-base rounded cursor-pointer focus:outline-none focus:shadow-outline hover:bg-primary-dark text-center"
>
  Download the .apk
</a>

          </div>
          {/* <ul className="list-inside text-xl space-y-2">
            <li>Decentralized</li>
            <li>Secure</li>
            <li>Fair</li>
          </ul> */}
        </div>

        {/* Right side - Card with Login only */}
        <div className="flex w-full md:w-1/2 justify-center">
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center w-full max-w-md p-6">
            <LoginForm />
            <div className="flex flex-row items-center justify-center my-6 w-full">
              <hr className="flex-grow border-neutral" />
              <p className="px-4 text-neutral">or</p>
              <hr className="flex-grow border-neutral" />
            </div>
            <CreateNewAccountButton />
          </div>
        </div>

      </div>
    </div>
  );
}
