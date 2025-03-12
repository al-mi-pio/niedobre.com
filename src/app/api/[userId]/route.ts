import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  return NextResponse.json({
    id: parseInt(params.userId),
  });
}
