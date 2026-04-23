import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { carnivoreAgent } from "../agents/carnivore-agent";

export const pdfToLLMReadableFormat = createStep({
	id: "pdf-to-LLM-readbale-format",
	description:
		"Takes array of pdf links get them and it creates text version of them",
	inputSchema: z.object({ pdfLinks: z.array(z.string()) }),
	outputSchema: z.object({ pdfLinks: z.array(z.string()) }),

	execute: async ({ inputData: { pdfLinks } }) => {
		// parse the pdfs to text
	},
});

export const findDealsFromPDFS = createStep({
	id: "find-deals-from-pdfs",
	description:
		"It takes an array of pdfs paths. It finds those pdfs and then it extracts deals from it.",
	inputSchema: z.object({}),
	outputSchema: z.void(),

	execute: async () => {
		const arrayOfPaths: string[] = [
			"./lib/broshura-0.pdf",
			"./lib/broshura-1.pdf",
		];

		for (const path of arrayOfPaths) {
			const response =
				await carnivoreAgent.generate(`You have this workspace-relative PDF path: ${path}.
          Read the PDF and use your create file tool to create a new markdown file in ./deals/.
          Name the output file after the PDF name.

          Extract all carnivore-relevant deals you find and format them like this:
          foodName: "name",
          price: "price",
          proteinToFatRation: alotMoreProtien | moreProtein | in middle | moreFat | A lot more Fat
          what if it was an images like png or jpeg can you work with that?
			`);

			console.log(response.text);
		}
	},
});

export const mainWorkflow = createWorkflow({
	id: "deal-finder-workflow",
	description: "The workflow that finds deals from pdfs",
	inputSchema: z.object({}),
	outputSchema: z.void(),
})
	.then(findDealsFromPDFS)
	.commit();
