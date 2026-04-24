import { Agent } from "@mastra/core/agent";
import { Workspace, LocalFilesystem } from "@mastra/core/workspace";

if (!process.env.FOLDER_PATH) {
	throw new Error("FOLDER_PATH environment variable is not set");
}

export const workspace = new Workspace({
	filesystem: new LocalFilesystem({
		basePath: process.env.FOLDER_PATH,
	}),
});

export const carnivoreAgent = new Agent({
	id: "carnivore-agent",
	name: "Carnivore agent",
	instructions: `You are helpful deal finder, you goal is to find deals for carnivore diet people.
	  Aka like eggs on discount and meats only, exclude breaded processed
			items and from diary only look for eggs nothing else`,
	model: "google/gemini-3.1-flash-lite-preview",
	workspace,
});

// Instrutciontns to be added when someome tells you open a webPage use the browser goto tool and then other like that to
