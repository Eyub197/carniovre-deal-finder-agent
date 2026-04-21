import { Mastra } from "@mastra/core/mastra";
import { carnivoreAgent } from "./agents/carnivore-agent";

export const mastra = new Mastra({
	agents: { carnivoreAgent },
});
