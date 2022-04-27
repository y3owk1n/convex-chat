import { Channel } from "@/types/common.types";
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
    if (channel) {
      if (channel.owner === identity.tokenIdentifier) {
        return db.delete(channelId);
      } else {
        return "NOT_OWNER";
      }
    }
  }
);
