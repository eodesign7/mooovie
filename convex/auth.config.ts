const clerkJwtIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN!;

if (!clerkJwtIssuerDomain) {
  throw new Error("CLERK_JWT_ISSUER_DOMAIN is not set");
}

const authConfig = {
  providers: [
    {
      domain: clerkJwtIssuerDomain,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
