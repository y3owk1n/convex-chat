import type { AppProps } from "next/app";
import { ConvexProvider, ConvexReactClient } from "convex-dev/react";
import convexConfig from "../convex.json";
import { ChakraProvider } from "@chakra-ui/react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthProvider } from "@/lib/auth";

const convex = new ConvexReactClient(convexConfig.origin);
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Auth0Provider
      // domain and clientId come from your Auth0 app dashboard
      domain="dev-7erd7tmk.jp.auth0.com"
      clientId="9hIBBfrcOpHEYGXvJw7g2DtaDCP8MDm7"
      redirectUri={"http://localhost:3000"}
      // allows auth0 to cache the authentication state locally
      cacheLocation="localstorage"
    >
      <ConvexProvider client={convex}>
        <AuthProvider>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </AuthProvider>
      </ConvexProvider>
    </Auth0Provider>
  );
};

export default MyApp;
