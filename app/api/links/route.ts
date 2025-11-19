import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 


function generateRandomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" }, 
    });
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { originalUrl, shortCode } = body;

    if (!originalUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let codeToUse = shortCode;


    if (shortCode) {

      const isValidFormat = /^[A-Za-z0-9]{6,8}$/.test(shortCode);
      if (!isValidFormat) {
        return NextResponse.json(
          { error: "Custom code must be 6-8 alphanumeric characters." },
          { status: 400 }
        );
      }


      const existing = await prisma.link.findUnique({
        where: { shortCode },
      });
      if (existing) {
        return NextResponse.json(
          { error: "This code is already taken." },
          { status: 409 } 
        );
      }
    } 

    else {
      let isUnique = false;
      while (!isUnique) {
        codeToUse = generateRandomCode(6);
        
        const existing = await prisma.link.findUnique({
          where: { shortCode: codeToUse },
        });
        if (!existing) isUnique = true;
      }
    }

    const newLink = await prisma.link.create({
      data: {
        originalUrl,
        shortCode: codeToUse,
      },
    });

    return NextResponse.json(newLink, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}