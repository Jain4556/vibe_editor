"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const RepoList = () => {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchRepos = async () => {
      const res = await fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const data = await res.json();
      setRepos(data);
    };

    fetchRepos();
  }, [session]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Your GitHub Repositories</h2>

      {repos.length === 0 && <p>Loading repos...</p>}

      {repos.map((repo) => (
        <div
          key={repo.id}
          className="p-3 border rounded mb-2 hover:bg-muted cursor-pointer"
        >
          {repo.name}
        </div>
      ))}
    </div>
  );
};

export default RepoList;