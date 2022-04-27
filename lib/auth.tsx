import { useConvex, useMutation } from "@/convex/_generated";
import { useAuth0 } from "@auth0/auth0-react";
import { ConvexReactClient } from "convex-dev/react";
import { Id } from "convex-dev/values";
import { useRouter } from "next/router";
import { createContext, FC, useContext, useEffect, useState } from "react";

export type AuthContextProps = {
  userId: Id | null;
};

const authContext = createContext<Partial<AuthContextProps>>({});

interface Props {
  children?: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = () => {
  const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const storeUser = useMutation("storeUser");
  const [userId, setUserId] = useState<Id | null>(null);
  const convex = useConvex();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      getIdTokenClaims().then(async (claims) => {
        // Get the raw ID token from the claims.
        let token = claims!.__raw;
        // Pass it to the Convex client.
        convex.setAuth(token);
        // Store the user in the database.
        // Recall that `storeUser` gets the user information via the `auth`
        // object on the server. You don't need to pass anything manually here.
        let id = await storeUser();
        setUserId(id);
      });
    } else {
      // Tell the Convex client to clear all authentication state.
      convex.clearAuth();
      setUserId(null);
    }
  }, [isAuthenticated, isLoading, getIdTokenClaims, storeUser, convex]);

  return {
    userId,
  };
};
