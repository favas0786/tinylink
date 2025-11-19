import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = (await params).code;


  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });


  if (!link) {
    return new NextResponse("Not Found", { status: 404 });
  }

 
  prisma.link.update({
    where: { id: link.id },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  }).catch((err: any) => console.error("Failed to track click", err));


  return NextResponse.redirect(link.originalUrl);
}