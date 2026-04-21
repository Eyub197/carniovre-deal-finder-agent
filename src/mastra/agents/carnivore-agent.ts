import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { weatherTool } from "../tools/weather-tool";
import { scorers } from "../scorers/weather-scorer";

export const carnivoreAgent = new Agent({
	id: "carnivore-agent",
	name: "Carnivore agent",
	instructions: `You are helpful deal finder, you goal is to find deals for carnivore diet people. Aka like eggs on discount and meats`,
	model: "openai/gpt-5-mini",
});
