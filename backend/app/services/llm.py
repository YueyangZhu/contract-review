import json
import httpx
from typing import List, Dict, Any
from app.core.config import get_settings
from app.services.mock_reviewer import mock_review


SYSTEM_PROMPT = """你是一名专业的合同审查法务助手。请仔细阅读用户提供的合同文本，识别潜在法律风险条款。

输出必须是严格的 JSON 数组，每个元素包含以下字段：
- clause: 风险条款原文（尽量简短，不超过 100 字）
- start_index: 条款在原文中的起始字符索引（整数）
- end_index: 条款在原文中的结束字符索引（整数）
- level: 风险等级，仅限 "high" / "medium" / "low"
- category: 风险分类，如 "付款条款" / "违约责任" / "知识产权" / "争议解决" 等
- description: 风险说明
- suggestion: 修改建议

只输出 JSON 数组，不要输出任何解释性文字、Markdown 代码块标记或其他内容。"""


async def review_contract(content: str) -> Dict[str, Any]:
    settings = get_settings()
    provider = settings.llm_provider.lower()

    if provider == "mock":
        return mock_review(content)

    if provider == "deepseek":
        return await _call_openai_compatible(
            base_url=settings.deepseek_base_url,
            api_key=settings.deepseek_api_key,
            model="deepseek-chat",
            content=content,
        )

    if provider == "openai":
        return await _call_openai_compatible(
            base_url=settings.openai_base_url,
            api_key=settings.openai_api_key,
            model="gpt-4o",
            content=content,
        )

    raise ValueError(f"不支持的 LLM 提供商: {provider}")


async def _call_openai_compatible(
    base_url: str, api_key: str, model: str, content: str
) -> Dict[str, Any]:
    if not api_key:
        raise ValueError("未配置 API Key")

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{base_url.rstrip('/')}/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": content},
                ],
                "temperature": 0.2,
            },
        )
        response.raise_for_status()
        data = response.json()
        raw = data["choices"][0]["message"]["content"]
        return _normalize_llm_output(raw, content)


def _normalize_llm_output(raw: str, content: str) -> Dict[str, Any]:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.lower().startswith("json"):
            raw = raw[4:].strip()

    risks: List[Dict[str, Any]] = json.loads(raw)
    score = max(0, 100 - sum(
        15 if r.get("level") == "high" else 8 if r.get("level") == "medium" else 3
        for r in risks
    ))

    high = sum(1 for r in risks if r.get("level") == "high")
    medium = sum(1 for r in risks if r.get("level") == "medium")
    low = sum(1 for r in risks if r.get("level") == "low")
    summary = f"AI 审核发现 {len(risks)} 处风险：高风险 {high} 处、中风险 {medium} 处、低风险 {low} 处。"

    return {"score": score, "summary": summary, "risks": risks}
