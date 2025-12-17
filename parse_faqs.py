import json
import re
from html import unescape
from pathlib import Path


HTML_PATH = Path("/Users/elvis/MarineNetAdminSide/marinenet-faq-raw.html")
FAQS_JSON_PATH = Path("/Users/elvis/MarineNetAdminSide/faqs.json")
DECISION_TREE_JSON_PATH = Path("/Users/elvis/MarineNetAdminSide/decision_tree.json")


def slugify(text: str) -> str:
    """
    Turn a heading or question into a slug-id.
    Example: "How do I change my Security Question & Answer (Q/A)?" ->
             "how-do-i-change-my-security-question-answer-q-a"
    """
    if not text:
        return ""
    text = text.lower()
    # Normalize common entities
    text = text.replace("&amp;", " and ")
    # Remove anything that's not a letter/number and replace runs with '-'
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def strip_tags(html: str) -> str:
    """Remove HTML tags, leaving only text."""
    # Remove tags
    text = re.sub(r"<[^>]+>", "", html)
    return text


def clean_text(text: str) -> str:
    """Unescape HTML entities and normalize whitespace."""
    text = unescape(text)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_answer_blocks(body_html: str):
    """
    Parse the contents of a single FAQ answer's <div class="card-body">...</div>
    into structured answerBlocks preserving order of paragraphs, lists, and headings.
    """
    blocks = []

    # Match top-level p, ol, ul, h1, h2 in order
    tag_pattern = re.compile(
        r"<(p|ol|ul|h1|h2)\b[^>]*>(.*?)</\1>",
        re.IGNORECASE | re.DOTALL,
    )

    for match in tag_pattern.finditer(body_html):
        tag = match.group(1).lower()
        inner = match.group(2)

        if tag in ("ol", "ul"):
            # Convert ordered/unordered lists into 'steps'
            items = []
            for li_match in re.finditer(
                r"<li\b[^>]*>(.*?)</li>",
                inner,
                re.IGNORECASE | re.DOTALL,
            ):
                li_inner = li_match.group(1)
                li_text = clean_text(strip_tags(li_inner))
                if li_text:
                    items.append(li_text)
            if items:
                blocks.append(
                    {
                        "type": "steps",
                        "items": items,
                    }
                )
        elif tag == "p":
            text = clean_text(strip_tags(inner))
            if not text:
                continue
            lower = text.lower()
            if lower.startswith("note:"):
                blocks.append({"type": "note", "text": text})
            else:
                blocks.append({"type": "paragraph", "text": text})
        elif tag in ("h1", "h2"):
            text = clean_text(strip_tags(inner))
            if text:
                blocks.append({"type": "subheading", "text": text})

    return blocks


def extract_categories(html: str):
    """
    Extract categories and their FAQ cards from the FAQ HTML.
    Structure in HTML:
      <h2>CATEGORY</h2>
      <div class="cmp-helpcenterpanel">...card(s)...</div>
      ...
    """
    categories = []

    # Find all category <h2> headings
    h2_matches = list(re.finditer(r"<h2>([^<]+)</h2>", html))
    if not h2_matches:
        return categories

    for idx, h2_match in enumerate(h2_matches):
        cat_title_raw = h2_match.group(1)
        cat_title = clean_text(strip_tags(cat_title_raw))
        cat_id = slugify(cat_title)

        start = h2_match.end()
        end = h2_matches[idx + 1].start() if idx + 1 < len(h2_matches) else len(html)
        cat_block = html[start:end]

        faqs = []

        # Each FAQ card
        card_pattern = re.compile(
            r'<div class="card my-4" id="(?P<cardId>[^"]+)">\s*'
            r'<div class="card-header[^>]*>(?P<headerHtml>.*?)</div>\s*'
            r'<div id="(?P<bodyId>[^"]+)" class="collapse[^>]*>\s*'
            r'<div class="card-body">\s*(?P<bodyHtml>.*?)\s*</div>\s*'
            r"</div>\s*</div>",
            re.DOTALL,
        )

        for card_match in card_pattern.finditer(cat_block):
            header_html = card_match.group("headerHtml")
            body_html = card_match.group("bodyHtml")

            # Question text lives inside header_html
            question_text = clean_text(strip_tags(header_html))
            if not question_text:
                continue

            faq_id = slugify(question_text)
            answer_blocks = parse_answer_blocks(body_html)

            faqs.append(
                {
                    "id": faq_id,
                    "question": question_text,
                    "answerBlocks": answer_blocks,
                }
            )

        if faqs:
            categories.append(
                {
                    "id": cat_id,
                    "title": cat_title,
                    "faqs": faqs,
                }
            )

    return categories


def build_faqs_and_decision_tree():
    html = HTML_PATH.read_text(encoding="utf-8")
    categories = extract_categories(html)

    faqs_root = {"categories": categories}
    FAQS_JSON_PATH.write_text(json.dumps(faqs_root, indent=2, ensure_ascii=False), encoding="utf-8")

    # Build decision tree
    nodes = []

    root_options = []
    for cat in categories:
        node_id = f"{cat['id']}-menu"
        root_options.append(
            {
                "label": cat["title"],
                "nextNodeId": node_id,
            }
        )

        options = []
        for faq in cat["faqs"]:
            options.append(
                {
                    "label": faq["question"],
                    "faqId": faq["id"],
                }
            )

        nodes.append(
            {
                "id": node_id,
                "prompt": f"{cat['title']} topics:",
                "options": options,
            }
        )

    decision_tree = {
        "nodes": [
            {
                "id": "root",
                "prompt": "What do you need help with?",
                "options": root_options,
            },
            *nodes,
        ]
    }

    DECISION_TREE_JSON_PATH.write_text(
        json.dumps(decision_tree, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    # Print a short summary
    print(f"Extracted {len(categories)} categories.")
    for cat in categories:
        print(f"- {cat['title']}: {len(cat['faqs'])} FAQs")


if __name__ == "__main__":
    build_faqs_and_decision_tree()



