import { z } from "zod";
import { getProjects } from "@/features/project/list/model/getProjects";

export const projectTools = {
  listProjects: {
    description: "List all projects with their status and basic information",
    parameters: z.object({}),
    execute: async function () {
      const projects = await getProjects();
      return projects;
    },
  },
}; 