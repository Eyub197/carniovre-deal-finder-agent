import { AgentBrowser } from "@mastra/agent-browser";
import { Agent } from "@mastra/core/agent";
import { Workspace, LocalFilesystem } from "@mastra/core/workspace";

if (!process.env.SCREENSHOT_PATH) {
	throw new Error("SCREENSHOT_PATH environment variable is not set");
}

export const workspace = new Workspace({
	filesystem: new LocalFilesystem({
		basePath: process.env.SCREENSHOT_PATH,
	}),
});

export const browser = new AgentBrowser({
	headless: false,
});

export const carnivoreAgent = new Agent({
	id: "carnivore-agent",
	name: "Carnivore agent",
	instructions: `You are helpful deal finder, you goal is to find deals for carnivore diet people. Aka like eggs on discount and meats`,
	model: "openai/gpt-5-mini",
	browser,
	workspace,
});
// Instrutciontns to be added when someome tells you open a webPage use the browser goto tool and then other like that to
