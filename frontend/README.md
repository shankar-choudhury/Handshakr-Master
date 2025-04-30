## CSDS493 Software Development

# Project: Handshakr

Handshakr provides users the ability to create and validate handshake agreements using end-to-end encryption. 
The system incorporates notaries for additional verification and relies on a decentralized approach with Bluetooth data transfer for local transactions.

This is the web interface frontend component of the Handshakr App. 
Deployed at [https://handshakr.duckdns.org](https://handshakr.duckdns.org)


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

You will need to use the deployed production version to navigate the app. 
You can run the dev server locally and access public routes(root and /register), but auth checks will prevent navigation to protected routes.

## Local Development and Deployment

Run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build the project

[Performant Node Package Manager (pnpm)](https://pnpm.io/installation) must be installed to build the project. 

Install dependencies: 

```bash
pnpm install
```

Create and run the build version

```bash
pnpm run build
pnpm build
```
## Documentation

Documentation is created as html pages. View them via ./docs/index.html

**Alternatively, build and view docs:**

Docs can be built using:

```bash
pnpm generate-docs
```

View them locally via localhost:

```bash
pnpm preview-docs
```

