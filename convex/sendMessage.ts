import { Message, User } from "@/types/common.types";
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
    const user: User = await db
      .table("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();
    const message = {
      body,
      channel,
      author: user.name,
      user: user._id,
      time: Date.now(),
    };
    return db.insert("messages", message);
  }
);
