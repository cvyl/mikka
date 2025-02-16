---
title: Unleashing the Power of CloudFlare's AI Workers
comment: false
date: 2024-01-21 19:40:37
tags: [ai, programming]
category: Article
---

# Introduction

CloudFlare's AI Workers allows developers to interact serverlessly with CloudFlare's AI models, providing a simple way to integrate AI into your applications.

## CloudFlare's AI Workers Overview

CloudFlare's AI Workers bring the capabilities of **A**rtificial **I**ntelligence (AI) directly into the realm of serverless computing.

Now, developers can use the power of AI models through CloudFlare's infrastructure, opening new possibilities for their applications. The AI Workers come with a REST API, allowing for easy integration and communication with CloudFlare's AI models. These include LLMs, Stable Diffusion, HuggingFace and more.

## Python Example: Interacting with CloudFlare's AI

This Python example that shows how to interact with CloudFlare's AI models. This script utilizes CloudFlare's REST API to run an AI model named "@cf/meta/llama-2-7b-chat-int8."

```python
import requests

API_BASE_URL = "https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/ai/run/"
headers = {"Authorization": "Bearer {API_TOKEN}"}

def run(model, inputs):
    input = { "messages": inputs }
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
    return response.json()

inputs = [
    { "role": "system", "content": "You are an AI" },
    { "role": "user", "content": "Write a short story about a llama that goes on a journey to find an orange cloud"}
]
output = run("@cf/meta/llama-2-7b-chat-int8", inputs)
print(output)
```

## JavaScript Example: Deployment with CloudFlare's AI

For developers looking to integrate CloudFlare's AI into their web applications (e.g. customer service chat bots or SaaS), the following JavaScript example showcases the deployment of an AI-powered function using CloudFlare Workers:

```javascript
import { Ai } from './vendor/@cloudflare/ai.js'

export default {
	async fetch(request, env) {
		const tasks = []
		const ai = new Ai(env.AI)

		// Prompt - simple completion-style input
		let simple = {
			prompt: 'Tell me a joke about CloudFlare'
		}
		let response = await ai.run('@cf/meta/llama-2-7b-chat-int8', simple)
		tasks.push({ inputs: simple, response })

		// Messages - chat-style input
		let chat = {
			messages: [
				{ role: 'system', content: 'You are a helpful assistant.' },
				{ role: 'user', content: 'Who won the world series in 2020?' }
			]
		}
		response = await ai.run('@cf/meta/llama-2-7b-chat-int8', chat)
		tasks.push({ inputs: chat, response })

		return Response.json(tasks)
	}
}
```

## Proof of Concept AI Worker

To see CloudFlare's AI Workers in action, check out my AI Chat App. It's a proof of concept that uses CloudFlare's AI, providing an eye into the capabilities and potential applications. Try it here: [ai.cvyl.me](https://ai.cvyl.me/).
