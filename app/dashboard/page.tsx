"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

import { deleteProjectById, duplicateProjectId, editProjectById, getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "@/modules/dashboard/components/project-table";
import RepoList from "@/modules/playground/components/repoList";


const Page = () => {
  const [playgrounds, setPlaygrounds] = useState<any[]>([]);
  const [view, setView] = useState<"projects" | "github">("projects");

  const { data: session } = useSession();

  // Fetch projects
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPlaygroundForUser();
      setPlaygrounds(data || []);
    };

    fetchData();
  }, []);

  // Auto switch after login
  useEffect(() => {
    if (session?.accessToken) {
      setView("github");
    }
  }, [session]);

  // Handle GitHub click
  const handleGithubClick = async () => {
    if (!session?.accessToken) {
      await signIn("github");
      return;
    }

    setView("github");
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
                onDeleteProject={deleteProjectById}
                onUpdateProject={editProjectById}
                onDuplicateProject={duplicateProjectId}
              />
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default Page;