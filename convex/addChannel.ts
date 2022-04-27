import { User } from "@/types/common.types";
import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(
  async ({ db, auth }, name: string): Promise<Id | "UNAUTHENTICATED"> => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      return "UNAUTHENTICATED";
    }
    const user: User = await db
      .table("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();
    return db.insert("channels", { name, owner: user._id });
  }
);
