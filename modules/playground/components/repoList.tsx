"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Repo = {
  id: number;
  name: string;
};

const RepoList = () => {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchRepos = async () => {
      try {
        const res = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const data = await res.json();

        // ✅ Ensure data is an array
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          console.error("GitHub API Error:", data);
          setRepos([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [session]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">
        Your GitHub Repositories
      </h2>

      {/* ✅ Session loading */}
      {status === "loading" && <p>Checking session...</p>}

      {/* ❌ No token */}
      {!session?.accessToken && status === "authenticated" && (
        <p className="text-red-500">Access token missing</p>
      )}

      {/* ⏳ Loading */}
      {loading && <p>Loading repos...</p>}

      {/* 📭 Empty */}
      {!loading && repos.length === 0 && (
        <p>No repositories found.</p>
      )}

      {/* ✅ Repo list */}
      {!loading &&
        repos.map((repo) => (
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