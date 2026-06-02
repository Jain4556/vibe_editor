import { scanTemplateDirectory } from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import { NextRequest } from "next/server";

// ✅ Validation function (keep simple)
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
  { params }: { params: { id: string } } // ✅ FIXED (removed Promise)
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "Missing playground ID" },
        { status: 400 }
      );
    }

    const playground = await db.playground.findUnique({
      where: { id },
    });

    if (!playground) {
      return Response.json(
        { error: "Playground not found" },
        { status: 404 }
      );
    }

    const templateKey = playground.template as keyof typeof templatePaths;
    const templatePath = templatePaths[templateKey];

    if (!templatePath) {
      return Response.json(
        { error: "Invalid template" },
        { status: 404 }
      );
    }

    // ✅ FIXED PATH (since folder is outside project)
    const inputPath = path.join(process.cwd(), templatePath);
    console.log("✅ templateKey:", templateKey);
    console.log("✅ templatePath:", templatePath);
    console.log("✅ inputPath:", inputPath);

    // ✅ Direct scan (no file system write/read)
    const result = await scanTemplateDirectory(inputPath);
console.log("FINAL PATH:", inputPath);


    if (!validateJsonStructure(result.items)) {
      return Response.json(
        { error: "Invalid JSON structure" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, templateJson: result },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ FULL API ERROR:", error);

    return Response.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
  
}

