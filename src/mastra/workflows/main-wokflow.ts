import { z } from "zod";
import { createWorkflow } from "@mastra/core/workflows";
import { getBroshurePdfsWorkflow } from "./lidl-pdf-download-workflow";
import { dealFinderWorkflow } from "./deal-finder-wokflow";
import { mealPlanMaker } from "./meal-plan-makes-workflow";

export const mainWorkflow = createWorkflow({
	id: "main-workflow",
	description: "The main workflow a wrapper for cleaner look",
	inputSchema: z.object({}),
	outputSchema: z.void({}),
})
	.then(getBroshurePdfsWorkflow)
	.then(dealFinderWorkflow)
	.then(mealPlanMaker)
	.commit();
