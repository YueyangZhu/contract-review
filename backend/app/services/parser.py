import os
from docx import Document
from PyPDF2 import PdfReader


async def parse_contract(file_path: str, file_type: str) -> str:
    ext = file_type.lower()
    if ext.endswith(".docx") or ext == "docx":
        return _parse_docx(file_path)
    if ext.endswith(".pdf") or ext == "pdf":
        return _parse_pdf(file_path)
    if ext.endswith(".txt") or ext == "txt":
        return _parse_txt(file_path)
    raise ValueError(f"不支持的文件类型: {file_type}")


def _parse_docx(file_path: str) -> str:
    doc = Document(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def _parse_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    texts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            texts.append(text)
    return "\n".join(texts)


def _parse_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()
