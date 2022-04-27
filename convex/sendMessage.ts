import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

// Send a chat message.
export default mutation(
  async (
    { db, auth },
    channel: Id,
    body: string
  ): Promise<Id | "UNAUTHENTICATED"> => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      return "UNAUTHENTICATED";
    }
    const user = await db
      .table("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();
    const message = {
      channel,
      body,
      time: Date.now(),
      user: user._id,
    };
    return db.insert("messages", message);
  }
);
