import { z } from "zod";
import fs from "node:fs/promises";
import { createStep } from "@mastra/core/workflows";
import { carnivoreAgent } from "../agents/carnivore-agent";

export const mealPlanMaker = createStep({
	id: "meal-plan-maker",
	description: "Created a meal plan based on deals and user passed macros",
	inputSchema: z.object({}),
	outputSchema: z.void(),

	execute: async () => {
		const deals = await fs.readdir("./deals");

		const content = await Promise.all(
			deals.map((deal) => fs.readFile(`./deals/${deal}`, "utf-8")),
		);

		await carnivoreAgent.generate(
			`From this deals ${content} your goal is to goal it to create a meal plan 1900 calories a day, 7 day meal plan, calculate weekly amounts and cost accordingly.
			and give it some overwiev like a small summary. Also at least 2 foods and no more then 5. and aim for maximum of 200euro a week of food coast.
		    Create a new file called meal-plan.md. in this format:
					for each food:
					foodName: "",
					priceForWeek: "",
					amount: "",

					then in the end of the file:
					thisWeekDietCoast: ""
			`,
		);
	},
});
