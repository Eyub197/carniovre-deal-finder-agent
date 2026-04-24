import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { carnivoreAgent } from "../agents/carnivore-agent";
import { PDFParse } from "pdf-parse";
import fs from "node:fs/promises";

export const pdfToLLMReadableFormat = createStep({
	id: "pdf-to-LLM-readbale-format",
	description:
		"Takes array of pdf links get them and it creates text version of them",
	inputSchema: z.object({ paths: z.array(z.string()) }),
	outputSchema: z.object({ pdfPaths: z.array(z.string()) }),

	execute: async ({ inputData: { paths } }) => {
		const pdfPaths = [];
		for (const path of paths) {
			const parser = new PDFParse({ url: path });
			const result = await parser.getText();

			await fs.writeFile(
				path.replace(".pdf", ".txt"),
				Buffer.from(result.text, "utf-8"),
			);

			pdfPaths.push(path.replace(".pdf", ".txt"));

			await parser.destroy();
		}
		return { pdfPaths };
	},
});

export const findDealsFromTextFiles = createStep({
	id: "find-deals-from-text-file",
	description:
		"It takes an array of pdfs paths. It finds those pdfs and then it extracts deals from it.",
	inputSchema: z.object({ pdfPaths: z.array(z.string()) }),
	outputSchema: z.object({}),

	execute: async ({ inputData: { pdfPaths } }) => {
		for (const path of pdfPaths) {
			const content = await fs.readFile(path, "utf-8");
			await carnivoreAgent.generate(
				`You have this text with the following content ${content}
          Read the text and use your create file tool to create a new markdown file in ./deals/ if there is no file in ./deals
          Name the output file after the text name. Look at eggs and meats only no diary.

          Look trought the whole file and dont worrky about being too long. Extract all carnivore-relevant deals you find and format them like this:
          foodName: "name",
          price: "price",
          proteinToFatRation: alotMoreProtien | moreProtein | in middle | moreFat | A lot more Fat
          packageSize: 500g | per kg |
			`,
			);
		}

		return {};
	},
});

export const dealFinderWorkflow = createWorkflow({
	id: "deal-finder-workflow",
	description: "The workflow that finds deals from pdfs",
	inputSchema: z.object({ paths: z.array(z.string()) }),
	outputSchema: z.object({}),
})
	.then(pdfToLLMReadableFormat)
	.then(findDealsFromTextFiles)
	.commit();
