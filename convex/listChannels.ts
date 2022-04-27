import { Channel } from "@/types/common.types";
import { query } from "convex-dev/server";

// List all chat channels.
export default query(async function listChannels({ db }): Promise<Channel[]> {
  return await db.table("channels").collect();
});
