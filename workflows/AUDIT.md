# n8n Workflow Public Audit

Source workflow: Commercial Negotiation Workflow_1.1
Node count: 49

## Removed or Redacted in Public Copy

- Removed all node `credentials` references, including credential names and IDs.
- Removed top-level workflow `id`, `versionId`, and `meta.instanceId` metadata.
- Removed `pinData` from the public copy.
- Removed webhook node `webhookId` values.
- Replaced the Google Drive file ID with `GOOGLE_DRIVE_FILE_ID`.
- Replaced direct Google Drive file URLs with placeholders.
- Replaced specific course PDF filename references with generic course-material wording where detected.

## Original Workflow Findings

- Top-level metadata present: workflow id=true, versionId=true, instanceId=true.
- pinData present: true; keys: (none).
- Token-like secret pattern hits: none detected.

## Credential References in Original Export

| Node | Credential type | Credential name | Credential ID |
| --- | --- | --- | --- |
| Supabase Vector Store | supabaseApi | Sup...unt (len 16) | cwR...GpT (len 16) |
| Google Drive | googleDriveOAuth2Api | Goo...t 3 (len 22) | hVj...NXL (len 16) |
| Supabase Vector Store1 | supabaseApi | Sup...unt (len 16) | cwR...GpT (len 16) |
| Postgres Chat Memory | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| Embeddings OpenAI | openAiApi | Ope...unt (len 14) | 46Y...AkF (len 16) |
| OpenAI Chat Model | openAiApi | Ope...unt (len 14) | 46Y...AkF (len 16) |
| Embeddings OpenAI1 | openAiApi | Ope...unt (len 14) | 46Y...AkF (len 16) |
| Insert rows in a table | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| OpenAI Chat Model1 | openAiApi | Ope...unt (len 14) | 46Y...AkF (len 16) |
| Supabase Vector Store2 | supabaseApi | Sup...unt (len 16) | cwR...GpT (len 16) |
| Embeddings OpenAI2 | openAiApi | Ope...unt (len 14) | 46Y...AkF (len 16) |
| Insert Questions | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| Get Current Session | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| Get Current Question | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| OpenAI Chat Model2 | openAiApi | Ope...unt (len 14) | 46Y...AkF (len 16) |
| Postgres Chat Memory1 | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| Update Question | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| Update Session | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| Supabase Vector Store3 | supabaseApi | Sup...unt (len 16) | cwR...GpT (len 16) |
| Embeddings OpenAI3 | openAiApi | Ope...unt (len 14) | 46Y...AkF (len 16) |
| Insert Messages | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| Fetch Messages | postgres | Pos...unt (len 16) | AQr...X8B (len 16) |
| Final Feedback Generator | openAiApi | Ope...unt (len 14) | 46Y...AkF (len 16) |

## Webhook References in Original Export

| Node | Path | Webhook ID |
| --- | --- | --- |
| Webhook | rag-chat | 76c...a74 (len 36) |

## Google Drive References in Original Export

| Node | File ID | Cached result name | Cached URL present |
| --- | --- | --- | --- |
| Google Drive | 105...NoO (len 33) | course-material.pdf | true |

## Prompt Nodes

| Node | System message length | Mentions document source |
| --- | ---: | --- |
| Start Planner | 2298 | true |
| Answer Evaluator | 3168 | false |
| Chat | 6797 | false |

## Manual Checks Still Required

- Confirm the prompt text is acceptable to publish and does not disclose NDA or partner-confidential course content.
- Confirm database table names and SQL structure are acceptable to publish.
- Configure fresh n8n credentials manually after importing the public copy.
- Rotate any credential if it was ever shared outside the private n8n instance.

