import re
from typing import Dict, Any, List


RISK_RULES = [
    {
        "id": "ip-ownership",
        "level": "high",
        "category": "知识产权",
        "patterns": [r"知识产权归乙方所有", r"成果归乙方所有"],
        "description": "委托开发项目中，知识产权全部归服务方所有，可能导致甲方无法拥有核心资产。",
        "suggestion": "建议约定开发成果知识产权归甲方所有，或约定双方共有及具体使用范围。",
    },
    {
        "id": "high-penalty",
        "level": "high",
        "category": "违约责任",
        "patterns": [r"违约金为合同总金额的百分之三十", r"违约金为合同总金额的\d{1,2}%", r"支付合同总金额 \d{1,2}% 的违约金", r"支付合同总金额\d{1,2}%的违约金"],
        "description": "违约金比例过高，远超司法实践中通常支持的合理范围。",
        "suggestion": "建议将违约金调整为不超过合同总金额的 20%，或约定实际损失赔偿原则。",
    },
    {
        "id": "payment-delay",
        "level": "medium",
        "category": "付款条款",
        "patterns": [r"最长不得超过验收合格后六个月", r"验收合格后\d{1,3}日内支付剩余", r"验收合格后.*\d{1,3}日.*支付.*货款"],
        "description": "尾款支付周期过长，影响资金周转，且验收标准不明确易引发争议。",
        "suggestion": "建议缩短尾款支付周期至验收合格后 30 日内，并明确验收标准与异议期限。",
    },
    {
        "id": "late-delivery-penalty",
        "level": "medium",
        "category": "违约责任",
        "patterns": [r"每逾期一日.*按合同总金额的千分之五", r"每日.*千分之五.*违约金", r"每逾期一日.*按合同总金额的 1%", r"每逾期一日.*按月租金的 10%"],
        "description": "逾期违约金比例过高，可能被法院认定为显失公平。",
        "suggestion": "建议将逾期违约金调整为合理比例，并设置上限。",
    },
    {
        "id": "late-payment-penalty",
        "level": "medium",
        "category": "违约责任",
        "patterns": [r"每逾期一日.*应按未付款项的\d{1,2}%", r"每逾期一日.*按未付款项的\d{1,2}%"],
        "description": "逾期付款违约金比例过高，可能加重违约方责任。",
        "suggestion": "建议将逾期付款违约金调整为日万分之五至千分之一之间，并设置上限。",
    },
    {
        "id": "probation-too-long",
        "level": "high",
        "category": "劳动合同",
        "patterns": [r"试用期为 \d 个月"],
        "description": "三年期劳动合同试用期最长不得超过 6 个月，且需符合法律规定。",
        "suggestion": "请核对试用期是否符合《劳动合同法》第十九条规定。",
    },
    {
        "id": "non-compete-no-pay",
        "level": "high",
        "category": "竞业限制",
        "patterns": [r"甲方无需向乙方支付竞业限制补偿金", r"竞业限制.*无需.*补偿"],
        "description": "竞业限制未约定补偿金，对劳动者显失公平，条款可能被认定无效。",
        "suggestion": "建议明确竞业限制补偿金标准，不低于劳动合同解除前 12 个月平均工资的 30%。",
    },
    {
        "id": "withhold-salary",
        "level": "medium",
        "category": "劳动报酬",
        "patterns": [r"甲方有权暂扣乙方最后一个月工资"],
        "description": "用人单位无权随意暂扣劳动者工资，可能违反劳动法。",
        "suggestion": "建议删除暂扣工资条款，通过其他合法方式保障工作交接。",
    },
    {
        "id": "one-sided-jurisdiction",
        "level": "low",
        "category": "争议解决",
        "patterns": [r"甲方所在地人民法院提起诉讼", r"甲方所在地仲裁委员会仲裁"],
        "description": "约定由甲方所在地管辖，对乙方存在一定的不利因素。",
        "suggestion": "建议约定为被告所在地或合同履行地法院/仲裁机构管辖，以保持双方地位对等。",
    },
]


def mock_review(content: str) -> Dict[str, Any]:
    risks: List[Dict[str, Any]] = []
    for rule in RISK_RULES:
        for pattern in rule["patterns"]:
            for match in re.finditer(pattern, content):
                risks.append({
                    "clause": match.group(0),
                    "start_index": match.start(),
                    "end_index": match.end(),
                    "level": rule["level"],
                    "category": rule["category"],
                    "description": rule["description"],
                    "suggestion": rule["suggestion"],
                })

    # Deduplicate by start_index
    seen = set()
    unique_risks = []
    for r in risks:
        if r["start_index"] not in seen:
            seen.add(r["start_index"])
            unique_risks.append(r)

    level_weight = {"high": 3, "medium": 2, "low": 1}
    unique_risks.sort(key=lambda x: level_weight[x["level"]], reverse=True)

    score = max(0, 100 - sum(
        15 if r["level"] == "high" else 8 if r["level"] == "medium" else 3
        for r in unique_risks
    ))

    high = sum(1 for r in unique_risks if r["level"] == "high")
    medium = sum(1 for r in unique_risks if r["level"] == "medium")
    low = sum(1 for r in unique_risks if r["level"] == "low")
    summary = f"AI 审核发现 {len(unique_risks)} 处风险：高风险 {high} 处、中风险 {medium} 处、低风险 {low} 处。"
    if score >= 80:
        summary += " 整体合同健康状况良好，但仍有部分条款建议优化。"
    elif score >= 60:
        summary += " 合同存在一定数量的风险点，建议重点审查高风险条款。"
    else:
        summary += " 合同风险较高，建议在签署前进行重大修改。"

    return {"score": score, "summary": summary, "risks": unique_risks}
