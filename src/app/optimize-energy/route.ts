import { NextRequest } from "next/server";
import { handleOptimizeEnergyRequest } from "@/server/handler";

export const maxDuration = 30; // 30 seconds Vercel / serverless timeout
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handleOptimizeEnergyRequest(req);
}
