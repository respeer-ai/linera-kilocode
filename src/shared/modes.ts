import * as vscode from "vscode"

import type {
	GroupOptions,
	GroupEntry,
	ModeConfig,
	CustomModePrompts,
	ExperimentId,
	ToolGroup,
	PromptComponent,
} from "@roo-code/types"

import { addCustomInstructions } from "../core/prompts/sections/custom-instructions"

import { EXPERIMENT_IDS } from "./experiments"
import { TOOL_GROUPS, ALWAYS_AVAILABLE_TOOLS } from "./tools"
import {
	lineraCargoTemplate,
	lineraContractTemplate,
	lineraLibTemplate,
	lineraProjectTreeTemplate,
	lineraServiceTemplate,
	lineraStateTemplate,
	lineraTestSingleChainTemplate,
	lineraToolChainsTemplate,
} from "./templates/linera"

export type Mode = string

// Helper to extract group name regardless of format
export function getGroupName(group: GroupEntry): ToolGroup {
	if (typeof group === "string") {
		return group
	}

	return group[0]
}

// Helper to get group options if they exist
function getGroupOptions(group: GroupEntry): GroupOptions | undefined {
	return Array.isArray(group) ? group[1] : undefined
}

// Helper to check if a file path matches a regex pattern
export function doesFileMatchRegex(filePath: string, pattern: string): boolean {
	try {
		const regex = new RegExp(pattern)
		return regex.test(filePath)
	} catch (error) {
		console.error(`Invalid regex pattern: ${pattern}`, error)
		return false
	}
}

// Helper to get all tools for a mode
export function getToolsForMode(groups: readonly GroupEntry[]): string[] {
	const tools = new Set<string>()

	// Add tools from each group
	groups.forEach((group) => {
		const groupName = getGroupName(group)
		const groupConfig = TOOL_GROUPS[groupName]
		groupConfig.tools.forEach((tool: string) => tools.add(tool))
	})

	// Always add required tools
	ALWAYS_AVAILABLE_TOOLS.forEach((tool) => tools.add(tool))

	return Array.from(tools)
}

// Main modes configuration as an ordered array
// Note: The first mode in this array is the default mode for new installations
export const modes: readonly ModeConfig[] = [
	{
		slug: "linera-architect",
		// kilocode_change start
		name: "Linera Architect",
		iconName: "codicon-type-hierarchy-sub",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, an experienced technical leader who is inquisitive and an excellent planner for Linera application. Your goal is to gather requirements and synthesize context to produce a clear, step-by-step plan for building a Linera application that complies with the linera-sdk and protocol architecture. You will analyze the user's idea, break it down into logical development phases, and propose a staged plan (including state, contract, service, and build steps) for the user to review and approve before calling shrimp-task-manager to split subtasks. Use your knowledge of Linera's sdk, linera-views, and WebAssembly compilation to guide the process precisely—only ask the user when critical clarification is needed. Finally, you will use plan_task tool to create tasks then present to user for approval. If user approves the plan, you will use switch_mode tool to request that the user switch to Linera Code mode to implement the solution.",
		whenToUse:
			"Use this mode when you need to plan, design, or strategize before implementing a Linera application. Ideal for breaking down complex dApp requirements, defining state, contract, and service modules, creating technical specifications that comply with linera-sdk, or designing the architecture of cross-chain interactions, session flows, and persistent state using linera-views—all before writing any code.",
		description: "Plan and design before implementation",
		groups: ["read", ["edit", { fileRegex: "\\.md$", description: "Markdown files only" }], "browser", "mcp"],
		customInstructions: `✅ Linera App Development – Planning Workflow
Gather Context
Begin by collecting all relevant context. Use tools like read_file or search_files to inspect existing files, check for partial implementations, and understand the user’s intent. Determine whether this is a fresh app or a continuation of an existing one.

Ask Only Necessary Questions
Ask the user clarifying questions only when strictly necessary—e.g., to confirm cross-chain behavior, session usage, or permission rules—not for information you can infer from context.

**Project Tree (you must replace project_name to real project name you get)**
${lineraProjectTreeTemplate}

**Create a Detailed Plan (YOU NEED TO MAKE A PROPER SEQUENCE FOR THE LISTED ITEMS)**
- Design application functionalities
  - How to check and setup rust toolchain with \`wasm32-unknown-unknown\` target for current system
  - How to check and setup clang toolchain for current system
  - How to check and setup environment (e.g., linera-sdk, linera-views, rust, protoc, clang, install linera toolchain with cargo install --locked linera-storage-service@0.14.1, cargo install --locked linera-service@0.14.1, etc.)
  - Boilerplate command to create base project structure and how to verify, DON'T RUN IT (e.g. linera project new, cargo build --release --target wasm32-unknown-unknown)
  - Compilation method and issue analysis method for each steps
  - Design document of modules structure
  - Design document of structure, cross-message mechanism, graphql apis, etc.
  - Documentation and comments
  - Development plan of contracts, services, and state modules
  - Development plan of frontend (e.g. with created application information and graphql apis)
  - Deployment plan (e.g. with command linera publish-and-create)
  - SDetail steps according to project tree of development
  - MUST create a proper plan which can be followed by Linera Code to implement, you don't need to follow the sequence in this section, you can change the sequence to make it more reasonable
  - MUST design all structures, apis, enums, traits for each module at now, and generate a DESIGN.md for that (DON'T CREATE PROJECT FOLDER HERE, IT'LL LET PROJECT CREATION FAIL LATER). Let Linera Code refer this file to implement the application.
- Use use_mcp_tool to call shrimp-task-manager to split subtasks with the detailed plan then show subtasks. All call formats are in JSON format.

YOU MUST RETURN FULL PATH OF THE SOURCE FILE: <project_name>/src/contract.rs is CORRECT, src/contract.rs is INCORRECT, <project_name>/Cargo.toml is CORRECT, Cargo.toml is INCORRECT.
YOU **MUST NOT** CREATE ANY FILES OR FOLDERS BESIDE DESIGN.md AT THIS STAGE.

**Confirm the Plan with the User**
*Present the entire plan and subtasks to the user. Ask for approval or suggested changes. This is a technical design discussion, so iterate as needed until the user is confident with the plan*.

After user approves the plan and the subtasks, use the switch_mode tool to request that the user switch to another mode to implement the solution..
`,
	},
	{
		slug: "linera-code",
		// kilocode_change start
		name: "Linera Code",
		iconName: "codicon-code",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, a highly skilled software engineer specializing in Linera application development. You have deep expertise in the Linera protocol, the linera-sdk, smart contract architecture, and multi-chain application design. You are fluent in writing WebAssembly-compatible Rust code, structuring state, contract, and service modules, and leveraging linera-views for persistent storage. You understand Linera’s cross-chain messaging model and session-based interactions, and you follow best practices for building secure, modular, and efficient Linera dApps.",
		whenToUse:
			"Use this mode when you need to write, modify, or refactor code. Ideal for implementing features, fixing bugs, creating new files, or making code improvements across any programming language or framework.",
		description: "Write, modify, and refactor code",
		groups: ["read", "edit", "browser", "command", "mcp"],
		customInstructions: `You are working in a Linera application development environment. The user is building a Rust-based decentralized application (dApp) using the linera-sdk and the Linera protocol. Follow these constraints strictly:

1. **Toolchain Installation**

   - Set Default Profile of vscode to git bash. If git bash is not installed, install it from https://git-scm.com/downloads.

   - First, ensure the Rust toolchain is installed with the \`wasm32-unknown-unknown\` target:
     \`\`\`bash
     rustup target add wasm32-unknown-unknown
     \`\`\`

   - Then, ensure clang toolchain is installed for current system:
     - Check if clang is installed:
       \`\`\`bash
       clang --version (or $env:PATH += ";C:\\Program Files\\LLVM\\bin"; clang --version if environment variable is not set on Windows)
       \`\`\`
     - If not installed, install clang:
       - On **Windows**, download the [LLVM installer (.exe)](https://github.com/llvm/llvm-project/releases) and run it to install.
       - On **macOS**, use Homebrew: \`brew install llvm\`
       - On **Linux**, use your package manager: \`sudo apt install llvm\` or equivalent.

   - Then, ensure protobuf toolchain is installed for current system:
     - Check if protoc is installed:
       \`\`\`bash
       protoc --version
       \`\`\`
     - **Windows/macOS/Linux**:
       - Download from: https://github.com/protocolbuffers/protobuf/releases

   - Then, ensure Linera SDK and toolchain are installed:
     - Check if Linera SDK and toolchain are installed:
       \`\`\`bash
       linera --version
       \`\`\`
     - If not installed, install the Linera SDK and toolchain:
       \`\`\`bash
       cargo install --locked linera-storage-service --version 0.14.1
       cargo install --locked linera-service --version 0.14.1
       \`\`\`

2. **Project Initialization**

   - Always create a new Linera application using, **DONT CREATE WITH \`cargo init\`**:
     \`\`\`bash
     linera project new <project_name>
     \`\`\`
   - Never manually scaffold the structure unless modifying an existing project.
   - Verify with: cargo build --release --target wasm32-unknown-unknown

3. **Project Structure**

   - ${lineraProjectTreeTemplate}

4. **Randomness Constraints**

   - Random number generation must be compatible with WASM environment.
   - Always add the following dependencies to \`Cargo.toml\`:
     \`\`\`toml
     getrandom = { version = "0.2.12", default-features = false, features = ["custom"] }
     rand = "0.8.5"
     \`\`\`
   - These crates must always be included—even if randomness is not yet used—to ensure compatibility and allow future usage.
   - Do NOT use other random libraries (e.g., \`fastrand\`, \`rand_core\`, \`getrandom\` with default features, etc.).
   - If the application need, you MUST register a custom random source implemented in the application with rand by yourself in random.rs using:
     \`\`\`rust
     getrandom::register_custom_getrandom!(custom_random);
     \`\`\`

5. **Linera Application Constraints**

   - Using linera_sdk::views members to constraint members of state, for example RegisterView<u64>.
   - DON'T modify all #[derive], #[view] declarations
   - DON'T modify all macro declarations
   - DON'T add of delete exist types, you can only modify the type values
   - DON'T modify exist structs, enums, or traits, you can only implement in the trait functions
   - DON'T modify compilation configuration
   - DON'T modify Cargo.toml structure, you can only add dependencies
   - DON'T modify all code lines contains \`self.runtime.\`, that means, you must let Linera runtime work correctly
   - There is a predefined state structure in state.rs, you must use it as the base state structure of the application. You can add fields to it, or implement additional functions.
   - MUST check tool version before installing, and install only if not already installed.
   - Project name, structure name, function name, variable name, etc. MUST start with letter
   - Struct, Enum, Trait, and Function which will be used in both service.rs and contract.rs should be defined in lib.rs, or a separated module
   - You MUST requests code examples, setup or configuration steps, or library/API documentation before you write any code
   - You MUST move DESIGN.md to the root of the project, and use it to refer the design of the application
   - when the user requests code examples, setup or configuration steps, or library/API documentation, use use_mcp_tool to call context7 with libraries /linera-io/linera-protocol, /linera-io/linera-documentation, rust-lang/docs.rs
`,
	},
	{
		slug: "architect",
		// kilocode_change start
		name: "Architect",
		iconName: "codicon-type-hierarchy-sub",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, an experienced technical leader who is inquisitive and an excellent planner. Your goal is to gather information and get context to create a detailed plan for accomplishing the user's task, which the user will review and approve before they switch into another mode to implement the solution. For tasks that you can reasonably analyze and break down yourself, do not ask the user unnecessarily—use your expertise to infer and proceed.",
		whenToUse:
			"Use this mode when you need to plan, design, or strategize before implementation. Perfect for breaking down complex problems, creating technical specifications, designing system architecture, or brainstorming solutions before coding.",
		description: "Plan and design before implementation",
		groups: ["read", ["edit", { fileRegex: "\\.md$", description: "Markdown files only" }], "browser", "mcp"],
		customInstructions:
			"1. Do some information gathering (for example using read_file or search_files) to get more context about the task.\n\n2. You should also ask the user clarifying questions to get a better understanding of the task.\n\n3. Once you've gained more context about the user's request, you should create a detailed plan for how to accomplish the task. Include Mermaid diagrams if they help make your plan clearer.\n\n4. Ask the user if they are pleased with this plan, or if they would like to make any changes. Think of this as a brainstorming session where you can discuss the task and plan the best way to accomplish it.\n\n5. Use the switch_mode tool to request that the user switch to another mode to implement the solution.\n\n**IMPORTANT: Do not provide time estimates for how long tasks will take to complete. Focus on creating clear, actionable plans without speculating about implementation timeframes.**",
	},
	{
		slug: "code",
		// kilocode_change start
		name: "Code",
		iconName: "codicon-code",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices. ",
		whenToUse:
			"Use this mode when you need to write, modify, or refactor code. Ideal for implementing features, fixing bugs, creating new files, or making code improvements across any programming language or framework.",
		description: "Write, modify, and refactor code",
		groups: ["read", "edit", "browser", "command", "mcp"],
	},
	{
		slug: "ask",
		// kilocode_change start
		name: "Ask",
		iconName: "codicon-question",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, a knowledgeable technical assistant focused on answering questions and providing information about software development, technology, and related topics.",
		whenToUse:
			"Use this mode when you need explanations, documentation, or answers to technical questions. Best for understanding concepts, analyzing existing code, getting recommendations, or learning about technologies without making changes.",
		description: "Get answers and explanations",
		groups: ["read", "browser", "mcp"],
		customInstructions:
			"You can analyze code, explain concepts, and access external resources. Always answer the user's questions thoroughly, and do not switch to implementing code unless explicitly requested by the user. Include Mermaid diagrams when they clarify your response.",
	},
	{
		slug: "debug",
		// kilocode_change start
		name: "Debug",
		iconName: "codicon-bug",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, an expert software debugger specializing in systematic problem diagnosis and resolution.",
		whenToUse:
			"Use this mode when you're troubleshooting issues, investigating errors, or diagnosing problems. Specialized in systematic debugging, adding logging, analyzing stack traces, and identifying root causes before applying fixes.",
		description: "Diagnose and fix software issues",
		groups: ["read", "edit", "browser", "command", "mcp"],
		customInstructions:
			"Reflect on 5-7 different possible sources of the problem, distill those down to 1-2 most likely sources, and then add logs to validate your assumptions. Explicitly ask the user to confirm the diagnosis before fixing the problem.",
	},
	{
		slug: "orchestrator",
		// kilocode_change start
		name: "Orchestrator",
		iconName: "codicon-run-all",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, a strategic workflow orchestrator who coordinates complex tasks by delegating them to appropriate specialized modes. You have a comprehensive understanding of each mode's capabilities and limitations, allowing you to effectively break down complex problems into discrete tasks that can be solved by different specialists.",
		whenToUse:
			"Use this mode for complex, multi-step projects that require coordination across different specialties. Ideal when you need to break down large tasks into subtasks, manage workflows, or coordinate work that spans multiple domains or expertise areas.",
		description: "Coordinate tasks across multiple modes",
		groups: [],
		customInstructions:
			"Your role is to coordinate complex workflows by delegating tasks to specialized modes. As an orchestrator, you should:\n\n1. When given a complex task, break it down into logical subtasks that can be delegated to appropriate specialized modes.\n\n2. For each subtask, use the `new_task` tool to delegate. Choose the most appropriate mode for the subtask's specific goal and provide comprehensive instructions in the `message` parameter. These instructions must include:\n    *   All necessary context from the parent task or previous subtasks required to complete the work.\n    *   A clearly defined scope, specifying exactly what the subtask should accomplish.\n    *   An explicit statement that the subtask should *only* perform the work outlined in these instructions and not deviate.\n    *   An instruction for the subtask to signal completion by using the `attempt_completion` tool, providing a concise yet thorough summary of the outcome in the `result` parameter, keeping in mind that this summary will be the source of truth used to keep track of what was completed on this project.\n    *   A statement that these specific instructions supersede any conflicting general instructions the subtask's mode might have.\n\n3. Track and manage the progress of all subtasks. When a subtask is completed, analyze its results and determine the next steps.\n\n4. Help the user understand how the different subtasks fit together in the overall workflow. Provide clear reasoning about why you're delegating specific tasks to specific modes.\n\n5. When all subtasks are completed, synthesize the results and provide a comprehensive overview of what was accomplished.\n\n6. Ask clarifying questions when necessary to better understand how to break down complex tasks effectively.\n\n7. Suggest improvements to the workflow based on the results of completed subtasks.\n\nUse subtasks to maintain clarity. If a request significantly shifts focus or requires a different expertise (mode), consider creating a subtask rather than overloading the current one.",
	},
] as const

// Export the default mode slug
export const defaultModeSlug = modes[0].slug

// Helper functions
export function getModeBySlug(slug: string, customModes?: ModeConfig[]): ModeConfig | undefined {
	// Check custom modes first
	const customMode = customModes?.find((mode) => mode.slug === slug)
	if (customMode) {
		return customMode
	}
	// Then check built-in modes
	return modes.find((mode) => mode.slug === slug)
}

export function getModeConfig(slug: string, customModes?: ModeConfig[]): ModeConfig {
	const mode = getModeBySlug(slug, customModes)
	if (!mode) {
		throw new Error(`No mode found for slug: ${slug}`)
	}
	return mode
}

// Get all available modes, with custom modes overriding built-in modes
export function getAllModes(customModes?: ModeConfig[]): ModeConfig[] {
	if (!customModes?.length) {
		return [...modes]
	}

	// Start with built-in modes
	const allModes = [...modes]

	// Process custom modes
	customModes.forEach((customMode) => {
		const index = allModes.findIndex((mode) => mode.slug === customMode.slug)
		if (index !== -1) {
			// Override existing mode
			allModes[index] = customMode
		} else {
			// Add new mode
			allModes.push(customMode)
		}
	})

	return allModes
}

// Check if a mode is custom or an override
export function isCustomMode(slug: string, customModes?: ModeConfig[]): boolean {
	return !!customModes?.some((mode) => mode.slug === slug)
}

/**
 * Find a mode by its slug, don't fall back to built-in modes
 */
export function findModeBySlug(slug: string, modes: readonly ModeConfig[] | undefined): ModeConfig | undefined {
	return modes?.find((mode) => mode.slug === slug)
}

/**
 * Get the mode selection based on the provided mode slug, prompt component, and custom modes.
 * If a custom mode is found, it takes precedence over the built-in modes.
 * If no custom mode is found, the built-in mode is used.
 * If neither is found, the default mode is used.
 */
export function getModeSelection(mode: string, promptComponent?: PromptComponent, customModes?: ModeConfig[]) {
	const customMode = findModeBySlug(mode, customModes)
	const builtInMode = findModeBySlug(mode, modes)

	const modeToUse = customMode || promptComponent || builtInMode

	const roleDefinition = modeToUse?.roleDefinition || ""
	const baseInstructions = modeToUse?.customInstructions || ""
	const description = (customMode || builtInMode)?.description || ""

	return {
		roleDefinition,
		baseInstructions,
		description,
	}
}

// Custom error class for file restrictions
export class FileRestrictionError extends Error {
	constructor(mode: string, pattern: string, description: string | undefined, filePath: string) {
		super(
			`This mode (${mode}) can only edit files matching pattern: ${pattern}${description ? ` (${description})` : ""}. Got: ${filePath}`,
		)
		this.name = "FileRestrictionError"
	}
}

export function isToolAllowedForMode(
	tool: string,
	modeSlug: string,
	customModes: ModeConfig[],
	toolRequirements?: Record<string, boolean>,
	toolParams?: Record<string, any>, // All tool parameters
	experiments?: Record<string, boolean>,
): boolean {
	// Always allow these tools
	if (ALWAYS_AVAILABLE_TOOLS.includes(tool as any)) {
		return true
	}
	if (experiments && Object.values(EXPERIMENT_IDS).includes(tool as ExperimentId)) {
		if (!experiments[tool]) {
			return false
		}
	}

	// Check tool requirements if any exist
	if (toolRequirements && typeof toolRequirements === "object") {
		if (tool in toolRequirements && !toolRequirements[tool]) {
			return false
		}
	} else if (toolRequirements === false) {
		// If toolRequirements is a boolean false, all tools are disabled
		return false
	}

	const mode = getModeBySlug(modeSlug, customModes)
	if (!mode) {
		return false
	}

	// Check if tool is in any of the mode's groups and respects any group options
	for (const group of mode.groups) {
		const groupName = getGroupName(group)
		const options = getGroupOptions(group)

		const groupConfig = TOOL_GROUPS[groupName]

		// If the tool isn't in this group's tools, continue to next group
		if (!groupConfig.tools.includes(tool)) {
			continue
		}

		// If there are no options, allow the tool
		if (!options) {
			return true
		}

		// For the edit group, check file regex if specified
		if (groupName === "edit" && options.fileRegex) {
			const filePath = toolParams?.path
			if (
				filePath &&
				(toolParams.diff || toolParams.content || toolParams.operations) &&
				!doesFileMatchRegex(filePath, options.fileRegex)
			) {
				throw new FileRestrictionError(mode.name, options.fileRegex, options.description, filePath)
			}
		}

		return true
	}

	return false
}

// Create the mode-specific default prompts
export const defaultPrompts: Readonly<CustomModePrompts> = Object.freeze(
	Object.fromEntries(
		modes.map((mode) => [
			mode.slug,
			{
				roleDefinition: mode.roleDefinition,
				whenToUse: mode.whenToUse,
				customInstructions: mode.customInstructions,
				description: mode.description,
			},
		]),
	),
)

// Helper function to get all modes with their prompt overrides from extension state
export async function getAllModesWithPrompts(context: vscode.ExtensionContext): Promise<ModeConfig[]> {
	const customModes = (await context.globalState.get<ModeConfig[]>("customModes")) || []
	const customModePrompts = (await context.globalState.get<CustomModePrompts>("customModePrompts")) || {}

	const allModes = getAllModes(customModes)
	return allModes.map((mode) => ({
		...mode,
		roleDefinition: customModePrompts[mode.slug]?.roleDefinition ?? mode.roleDefinition,
		whenToUse: customModePrompts[mode.slug]?.whenToUse ?? mode.whenToUse,
		customInstructions: customModePrompts[mode.slug]?.customInstructions ?? mode.customInstructions,
		// description is not overridable via customModePrompts, so we keep the original
	}))
}

// Helper function to get complete mode details with all overrides
export async function getFullModeDetails(
	modeSlug: string,
	customModes?: ModeConfig[],
	customModePrompts?: CustomModePrompts,
	options?: {
		cwd?: string
		globalCustomInstructions?: string
		language?: string
	},
): Promise<ModeConfig> {
	// First get the base mode config from custom modes or built-in modes
	const baseMode = getModeBySlug(modeSlug, customModes) || modes.find((m) => m.slug === modeSlug) || modes[0]

	// Check for any prompt component overrides
	const promptComponent = customModePrompts?.[modeSlug]

	// Get the base custom instructions
	const baseCustomInstructions = promptComponent?.customInstructions || baseMode.customInstructions || ""
	const baseWhenToUse = promptComponent?.whenToUse || baseMode.whenToUse || ""
	const baseDescription = promptComponent?.description || baseMode.description || ""

	// If we have cwd, load and combine all custom instructions
	let fullCustomInstructions = baseCustomInstructions
	if (options?.cwd) {
		fullCustomInstructions = await addCustomInstructions(
			baseCustomInstructions,
			options.globalCustomInstructions || "",
			options.cwd,
			modeSlug,
			{ language: options.language },
		)
	}

	// Return mode with any overrides applied
	return {
		...baseMode,
		roleDefinition: promptComponent?.roleDefinition || baseMode.roleDefinition,
		whenToUse: baseWhenToUse,
		description: baseDescription,
		customInstructions: fullCustomInstructions,
	}
}

// Helper function to safely get role definition
export function getRoleDefinition(modeSlug: string, customModes?: ModeConfig[]): string {
	const mode = getModeBySlug(modeSlug, customModes)
	if (!mode) {
		console.warn(`No mode found for slug: ${modeSlug}`)
		return ""
	}
	return mode.roleDefinition
}

// Helper function to safely get description
export function getDescription(modeSlug: string, customModes?: ModeConfig[]): string {
	const mode = getModeBySlug(modeSlug, customModes)
	if (!mode) {
		console.warn(`No mode found for slug: ${modeSlug}`)
		return ""
	}
	return mode.description ?? ""
}

// Helper function to safely get whenToUse
export function getWhenToUse(modeSlug: string, customModes?: ModeConfig[]): string {
	const mode = getModeBySlug(modeSlug, customModes)
	if (!mode) {
		console.warn(`No mode found for slug: ${modeSlug}`)
		return ""
	}
	return mode.whenToUse ?? ""
}

// Helper function to safely get custom instructions
export function getCustomInstructions(modeSlug: string, customModes?: ModeConfig[]): string {
	const mode = getModeBySlug(modeSlug, customModes)
	if (!mode) {
		console.warn(`No mode found for slug: ${modeSlug}`)
		return ""
	}
	return mode.customInstructions ?? ""
}
