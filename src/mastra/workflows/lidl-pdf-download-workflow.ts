import { createWorkflow } from "@mastra/core/workflows";
import { createStep } from "@mastra/core/workflows/evented";
import { chromium } from "playwright";
import { z } from "zod";
import { getEndOfTheWeek } from "../utils";

const getActiveLinkPages = createStep({
	id: "get-lidl-broshure-page",
	description: "Gets the current active broushres from lidl.bg",
	inputSchema: z.object({}),
	outputSchema: z.object({ urls: z.array(z.string()) }),

	execute: async () => {
		const urls: string[] = [];

		const res = await fetch("https://www.lidl.bg/c/broshuri/s10020060");
		const text = await res.text();
		const matches = text.matchAll(/href="([^"]*\/l\/bg\/broshura\/[^"]*)"/g);
		const endOfTheWeek = getEndOfTheWeek();

		for (const match of matches) {
			const url = match[1].split("/");
			const [, , , , , , date] = url;
			const broshureDate = date.split("-");
			const [broshureDay, broshureMonth] = broshureDate;
			const broshureStartDate = new Date();
			broshureStartDate.setDate(Number(broshureDay));
			broshureStartDate.setMonth(Number(broshureMonth) - 1);

			if (broshureStartDate < endOfTheWeek) {
				urls.push(match[1]);
			}
		}

		return { urls };
	},
});

const downloadBroshurePdfs = createStep({
	id: "download-pdfs",
	description: "Gets links with active broshures and downloads pdfs",
	inputSchema: z.object({ urls: z.array(z.string()) }),
	outputSchema: z.object({ paths: z.array(z.string()) }),

	execute: async ({ inputData: { urls } }) => {
		const paths: string[] = [];
		const browser = await chromium.launch();
		const context = await browser.newContext();

		const cookiePage = await context.newPage();
		await cookiePage.goto(urls[0]);

		await cookiePage.waitForSelector("text='ПРИЕМАНЕ'", { timeout: 4000 });
		if (await cookiePage.locator("text='ПРИЕМАНЕ'").isVisible()) {
			await cookiePage.click("text='ПРИЕМАНЕ'");
		}

		try {
			for (const [index, url] of urls.entries()) {
				const page = await context.newPage();
				await page.goto(url);

				await page.click('[aria-label="Меню"]');

				const [download] = await Promise.all([
					page.waitForEvent("download"),
					page.click('text="Свали PDF"'),
				]);

				const path = `./lib/broshura-${index}.pdf`;
				await download.saveAs(path);

				paths.push(path);
			}
		} catch (error) {
			console.error(error);
		} finally {
			await context.close();
			await browser.close();
		}

		return { paths };
	},
});

export const getBroshurePdfsWorkflow = createWorkflow({
	id: "get-broshure-pdfs",
	inputSchema: z.object({}),
	outputSchema: z.object({ paths: z.array(z.string()) }),
})
	.then(getActiveLinkPages)
	.then(downloadBroshurePdfs)
	.commit();
