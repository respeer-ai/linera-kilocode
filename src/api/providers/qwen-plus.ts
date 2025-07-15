import { qwenPlusModels, qwenPlusDefaultModelId } from "@roo-code/types"

import type { ApiHandlerOptions } from "../../shared/api"

import type { ApiStreamUsageChunk } from "../transform/stream"
import { getModelParams } from "../transform/model-params"

import { OpenAiHandler } from "./openai"

export class QwenPlusHandler extends OpenAiHandler {
	constructor(options: ApiHandlerOptions) {
		super({
			...options,
			openAiApiKey: options.qwenPlusApiKey ?? "not-provided",
			openAiModelId: options.apiModelId ?? qwenPlusDefaultModelId,
			openAiBaseUrl: options.qwenPlusBaseUrl ?? "https://dashscope.aliyuncs.com/compatible-mode/v1",
			openAiStreamingEnabled: true,
			includeMaxTokens: true,
			openAiLegacyFormat: true,
		})
	}

	override getModel() {
		const id = this.options.apiModelId ?? qwenPlusDefaultModelId
		const info = qwenPlusModels[id as keyof typeof qwenPlusModels] || qwenPlusModels[qwenPlusDefaultModelId]
		const params = getModelParams({ format: "openai", modelId: id, model: info, settings: this.options })
		return { id, info, ...params }
	}

	// Override to handle QwenPlus's usage metrics, including caching.
	protected override processUsageMetrics(usage: any): ApiStreamUsageChunk {
		return {
			type: "usage",
			inputTokens: usage?.prompt_tokens || 0,
			outputTokens: usage?.completion_tokens || 0,
			cacheWriteTokens: usage?.prompt_tokens_details?.cache_miss_tokens,
			cacheReadTokens: usage?.prompt_tokens_details?.cached_tokens,
		}
	}
}
