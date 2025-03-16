import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  return NextResponse.json({
    id: parseInt((await params).userId),
  });
}
