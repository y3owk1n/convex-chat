import { Channel, User } from "@/types/common.types";
import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(
  async (
    { db, auth },
    channelId: Id
  ): Promise<void | "UNAUTHENTICATED" | "NOT_OWNER"> => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      return "UNAUTHENTICATED";
    }
    const channel: Channel = await db.get(channelId);
    const user: User = await db
      .table("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();
    if (channel) {
      if (channel.owner.equals(user._id)) {
        return db.delete(channelId);
      } else {
        return "NOT_OWNER";
      }
    }
  }
);
