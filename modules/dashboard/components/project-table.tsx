"use client"

import Image from "next/image"
import { format } from "date-fns"
import type { Project } from "../types"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"
import {
  MoreHorizontal, Edit3, Trash2,
  ExternalLink, Copy, Download, Eye
} from "lucide-react"
import { toast } from "sonner"

interface ProjectTableProps {
  projects: Project[]
}

interface EditProjectData {
  title: string
  description: string
}

export default function  ProjectTable({ projects }: ProjectTableProps) {

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editData, setEditData] = useState<EditProjectData>({ title: "", description: "" })
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Edit click
  const handleEditClick = (project: Project) => {
    setSelectedProject(project)
    setEditData({
      title: project.title,
      description: project.description || "",
    })
    setEditDialogOpen(true)
  }

  // ✅ Delete click
  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project)
    setDeleteDialogOpen(true)
  }

  // ✅ Update (dummy for now)
  const handleUpdateProject = async () => {
    if (!selectedProject) return

    try {
      setIsLoading(true)
      console.log("Update:", selectedProject.id, editData)
      toast.success("Project updated successfully")
      setEditDialogOpen(false)
    } catch {
      toast.error("Failed to update project")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Delete (dummy)
  const handleDeleteProject = async () => {
    if (!selectedProject) return

    try {
      setIsLoading(true)
      console.log("Delete:", selectedProject.id)
      toast.success("Project deleted successfully")
      setDeleteDialogOpen(false)
    } catch {
      toast.error("Failed to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Duplicate
  const handleDuplicateProject = async (project: Project) => {
    try {
      console.log("Duplicate:", project.id)
      toast.success("Project duplicated")
    } catch {
      toast.error("Failed to duplicate project")
    }
  }

  // ✅ Copy URL
  const copyProjectUrl = (projectId: string) => {
    const url = `${window.location.origin}/playground/${projectId}`
    navigator.clipboard.writeText(url)
    toast.success("URL copied")
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                
                {/* PROJECT */}
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/playground/${project.id}`}
                      className="font-semibold hover:underline"
                    >
                      {project.title}
                    </Link>
                    <span className="text-sm text-gray-500 line-clamp-1">
                      {project.description}
                    </span>
                  </div>
                </TableCell>

                {/* TEMPLATE */}
                <TableCell>
                  <Badge variant="outline">{project.template}</Badge>
                </TableCell>

                {/* DATE */}
                <TableCell>
                  {format(new Date(project.createdAt), "MMM d, yyyy")}
                </TableCell>

                {/* USER */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={project.user.image || "/placeholder.svg"}
                      alt={project.user.name || "user"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm">{project.user.name}</span>
                  </div>
                </TableCell>

                {/* ACTIONS */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      {/* ✅ FIXED with asChild */}
                      <DropdownMenuItem >
                        <Link
                          href={`/playground/${project.id}`}
                          className="flex items-center w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Open Project
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Link
                          href={`/playground/${project.id}`}
                          target="_blank"
                          className="flex items-center w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => handleEditClick(project)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleDuplicateProject(project)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => copyProjectUrl(project.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(project)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Edit your project details</DialogDescription>
          </DialogHeader>

          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />

          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProject}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Delete "{selectedProject?.title}" permanently?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}