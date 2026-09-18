import { NextRequest } from "next/server";
import { handleOptimizeEnergyRequest } from "@/server/handler";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handleOptimizeEnergyRequest(req);
}
