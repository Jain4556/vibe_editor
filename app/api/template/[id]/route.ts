import { scanTemplateDirectory } from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

// ✅ Validation function
function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Next.js 16 format
) {
  try {
    // ✅ Correct way to access params
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing playground ID" },
        { status: 400 }
      );
    }

    // ✅ Fetch from DB
    const playground = await db.playground.findUnique({
      where: { id },
    });

    if (!playground) {
      return NextResponse.json(
        { error: "Playground not found" },
        { status: 404 }
      );
    }

    // ✅ Get template path
    const templateKey = playground.template as keyof typeof templatePaths;
    const templatePath = templatePaths[templateKey];

    if (!templatePath) {
      return NextResponse.json(
        { error: "Invalid template" },
        { status: 404 }
      );
    }

    // ✅ Safe path resolution
    const inputPath = path.join(process.cwd(), templatePath);

    console.log("templateKey:", templateKey);
    console.log("templatePath:", templatePath);
    console.log("inputPath:", inputPath);

    // ✅ Scan directory
    const result = await scanTemplateDirectory(inputPath);

    // ✅ Validate JSON
    if (!validateJsonStructure(result?.items)) {
      return NextResponse.json(
        { error: "Invalid JSON structure" },
        { status: 500 }
      );
    }

    // ✅ Success response
    return NextResponse.json(
      {
        success: true,
        templateJson: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FULL API ERROR:", error);

    return NextResponse.json(
      {
        error: (error as Error).message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}