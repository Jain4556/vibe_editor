"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

import {
  deleteProjectById,
  duplicateProjectId,
  editProjectById,
  getAllPlaygroundForUser,
} from "@/modules/dashboard/actions";

import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "@/modules/dashboard/components/project-table";
import RepoList from "@/modules/playground/components/repoList";

const Page = () => {
  const [playgrounds, setPlaygrounds] = useState<any[]>([]);
  const [view, setView] = useState<"projects" | "github">("projects");

  const { data: session } = useSession();

  // ✅ Fetch projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPlaygroundForUser();
        setPlaygrounds(data || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Auto switch after login
  useEffect(() => {
    if (session?.accessToken) {
      setView("github");
    }
  }, [session]);

  // ✅ Handle GitHub click
  const handleGithubClick = async () => {
    if (!session?.accessToken) {
      await signIn("github");
      return;
    }

    setView("github");
  };

  // 🔥 FIX: Proper delete handler
  const handleDeleteProject = async (id: string) => {
    try {
      console.log("Deleting project:", id);

      await deleteProjectById(id);

      // ✅ Update UI immediately
      setPlaygrounds((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // 🔥 Optional: Update handler (for edit)
  const handleUpdateProject = async (id: string, data: any) => {
    try {
      const updated = await editProjectById(id, data);

      setPlaygrounds((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 🔥 Optional: Duplicate handler
  const handleDuplicateProject = async (id: string) => {
    try {
      const newProject = await duplicateProjectId(id);

      setPlaygrounds((prev) => [newProject, ...prev]);
    } catch (error) {
      console.error("Duplicate failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen mx-auto max-w-7xl px-4 py-10">
      
      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full items-stretch">
        
        <div className="h-full" onClick={() => setView("projects")}>
          <AddNewButton />
        </div>

        <div className="h-full">
          <AddRepo onClick={handleGithubClick} />
        </div>

      </div>

      {/* Content */}
      <div className="w-full mt-8">

        {view === "github" && <RepoList />}

        {view === "projects" && (
          <div className="mt-6 flex flex-col items-center w-full">
            {playgrounds.length === 0 ? (
              <EmptyState />
            ) : (
              <ProjectTable
                projects={playgrounds}
                onDeleteProject={handleDeleteProject}   // ✅ FIXED
                onUpdateProject={handleUpdateProject}   // ✅ SAFE
                onDuplicateProject={handleDuplicateProject} // ✅ SAFE
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Page;