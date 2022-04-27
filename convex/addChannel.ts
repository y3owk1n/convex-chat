import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(
  async ({ db, auth }, name: string): Promise<Id | "UNAUTHENTICATED"> => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      return "UNAUTHENTICATED";
    }
    return db.insert("channels", { name, owner: identity.tokenIdentifier });
  }
);
