## MarineNet FAQ Chatbot – Project Summary

This document explains the structure and behavior of the MarineNet FAQ chatbot prototype in this repository so other developers or project managers can quickly get oriented.

The core idea is a **no-LLM, rules-based helper** that:
- Scrapes the official MarineNet FAQ content.
- Stores it in structured JSON.
- Exposes it via a small, static HTML/JS demo (`faq-chat-demo.html`) that behaves like an instant-messaging assistant running entirely in the browser (no backend).

---

## High-Level Architecture

### Components

- **`marinenet-faq-raw.html`**
  - Saved HTML of the MarineNet FAQ page (behind login).
  - Source of truth for all FAQ categories, questions, and answers.

- **`parse_faqs.py`**
  - Python script that parses `marinenet-faq-raw.html` and generates:
    - `faqs.json` – structured FAQ content.
    - `decision_tree.json` – navigational decision tree referring into `faqs.json`.
  - Intended to be re-run whenever the FAQ page changes.

- **`faqs.json`**
  - Layer 1 “knowledge base” of all FAQs.
  - Structure:
    - `categories[]` → each has:
      - `id`: slug (e.g., `account-management`).
      - `title`: display title (e.g., `ACCOUNT MANAGEMENT`).
      - `faqs[]`: question + structured answer blocks.

- **`decision_tree.json`**
  - Layer 2 decision tree describing how to navigate the FAQ content.
  - Structure:
    - `nodes[]`:
      - `id`: node id (e.g., `root`, `account-management-menu`).
      - `prompt`: text to show the user (“ACCOUNT MANAGEMENT topics:”).
      - `options[]`:
        - `label`: choice text.
        - `nextNodeId?`: jump to another node.
        - `faqId?`: leaf that resolves to a FAQ in `faqs.json`.

- **`faq-chat-demo.html`**
  - A **standalone local demo**:
    - Embeds (copies) the full contents of `faqs.json` and `decision_tree.json` as JS constants.
    - Uses HTML + CSS + vanilla JS.
    - Can be opened directly from disk (no server required).
  - Implements an IM-style chat interface with:
    - Floating `?` button.
    - Chat panel with messages and options.
    - Free-text input and “Send” button.

---

## FAQ Extraction (`parse_faqs.py`)

### Source HTML Structure

The MarineNet FAQ page is structured as:
- Category headings: `<h2>ACCOUNT MANAGEMENT</h2>`, `<h2>REQUESTS</h2>`, etc.
- Under each `<h2>`: multiple `div.card` “accordion” panels with:
  - `card-header` → question text.
  - `card-body` → one or more `<p>`, `<ol>`, `<ul>`, `<h1>/<h2>` tags comprising the answer.

`parse_faqs.py`:
- Scans for category `<h2>` elements.
- For each category, parses all associated `div.card` blocks to extract:
  - **Question** (from header text).
  - **Answer blocks** from the body:
    - Paragraphs.
    - Ordered/unordered lists.
    - Subheadings.
    - Notes (paragraphs starting with “Note:”).

### Answer Block Types

Each FAQ answer is represented as an array of `answerBlocks[]` with specific types:

- `paragraph`:
  - `{ "type": "paragraph", "text": "Free form text..." }`

- `steps` (from `<ol>` or `<ul>`):
  - `{ "type": "steps", "items": ["Step 1", "Step 2", ...] }`

- `note`:
  - `{ "type": "note", "text": "Note: ..." }`

- `subheading`:
  - `{ "type": "subheading", "text": "Subsection Title" }`

This structured representation allows the UI to render answers with appropriate emphasis and layout without HTML parsing in the browser.

### Slugs and IDs

- Category IDs (e.g., `account-management`) and FAQ IDs (e.g., `how-do-i-change-my-password`) are derived via a `slugify` helper:
  - Lowercases the text.
  - Replaces non-alphanumeric characters with `-`.
  - Trims leading/trailing hyphens.
- These IDs are stable keys for:
  - Linking `decision_tree.json` options → FAQs (`faqId`).
  - Implementing keyword-based routing in the chat demo.

### Running the Extractor

From the repo root (`/Users/elvis/MarineNetAdminSide`):

```bash
python3 parse_faqs.py
```

What it does:
- Reads `marinenet-faq-raw.html`.
- Writes/overwrites `faqs.json` and `decision_tree.json`.
- Prints a summary of categories and FAQ counts.

---

## Chatbot Demo (`faq-chat-demo.html`)

### Overview

`faq-chat-demo.html` is the main deliverable for stakeholders:
- Works by simply opening the file in a browser (no server).
- Uses only HTML, CSS, and JavaScript.
- Embeds:
  - `FAQS_DATA` – full FAQ dataset.
  - `DECISION_TREE` – full tree of categories and FAQ options.

You **do not** need to run `parse_faqs.py` to use the demo; the JSON is already inlined. Running the script is only necessary when updating to a new version of the FAQ page.

### UI Behavior

- **Floating chat button (`?`)**
  - Fixed bottom-right.
  - Clicking toggles the chat panel open/closed.

- **Chat layout**
  - Chat panel has:
    - Header: assistant name and subtitle.
    - Body: scrollable IM-style conversation.
    - Input row: text box + Send.
    - Footer buttons: **Main menu**, **Back**.
  - Messages are styled as:
    - Bot bubbles: left-aligned, grey.
    - User bubbles: right-aligned, blue.

- **Initial greeting**
  - On open, the bot says:
    - “How can I help you today? You can type a question or pick one of these options:”
  - Shows quick reply buttons:
    - “Account & login help”
    - “Courses & testing”
    - “Adobe Connect / meetings”

### Core Logic Layers

The JS in `faq-chat-demo.html` has three main layers:

1. **Data indexing**
   - Builds `nodesById` from `DECISION_TREE.nodes`.
   - Builds `faqById` from `FAQS_DATA.categories[].faqs[]`.

2. **Rendering helpers**
   - `appendBot(text)` / `appendUser(text)` to add chat bubbles.
   - `appendOptions(options[])` to render clickable options list.
   - `showFaq(faqId)` to render a FAQ question + all its `answerBlocks` inside a bot bubble.
   - `showCategoryMenu(nodeId)` to render a category node (prompt + FAQ options).
   - `showRootMenu()` to show featured top-level areas.

3. **Conversation state and routing**
   - State:
     - `currentNodeId`
     - `historyStack` (for “Back” behavior).
     - `lastMenuNodeId` (for going back to the last category menu after a FAQ).
     - `pendingCategoryNodeId` (for Yes/No confirmation).
     - `unknownAreaCount` (to track repeated “I’m not sure” cases).
   - Main handler:
     - `handleUserText(rawText)` is called when user clicks Send or presses Enter.
     - Applies a sequence of specialized routing rules before falling back to generic decision-tree logic.

---

## Keyword & Intent Handling

The chatbot currently uses simple rules to map user free-text into either:
- Direct FAQ suggestions, or
- A category in the decision tree.

### Special-Case Intents

The following intents have explicit handling **before** category detection:

#### 1. Help / Helpdesk

Triggers if the normalized message matches or contains:
- `"help"`, `"helpdesk"`, `"help desk"`, `"support"`, `"support ticket"`, `"trouble ticket"` (or contains “helpdesk”, “help desk”, “trouble ticket”).

Behavior:
- Resets `unknownAreaCount`.
- Bot says:
  - “You can either submit a trouble ticket or contact the MarineNet Help Desk:”
- Shows two options:
  - **Submit Trouble Ticket**
    - Attempts `window.open` to the MarineNet LMS help portal:
      - [`https://lmshelp.marinenet.usmc.mil/jira/servicedesk/customer/portal/1`](https://lmshelp.marinenet.usmc.mil/jira/servicedesk/customer/portal/1)
    - If a popup blocker prevents opening:
      - Renders a fallback bubble with a direct clickable link: “click here to submit a trouble ticket.”
  - **Contact Help Desk**
    - Renders the “How do I call the MarineNet Help Desk?” FAQ, including:
      - 1-888-4DL-USMC (435-8762)
      - DSN-995-6049
      - 301-995-6049 (Commercial)

#### 2. RUC / RUCs

Triggers when the text contains `ruc` or `rucs` as a word.

Behavior:
- Resets `unknownAreaCount`.
- Shows a set of related Training Manager FAQs as options, including:
  - “As a Training Manager, how do I add different RUCs to my account?”
  - “What if I do not meet all of the requirements to be a Training Manager (TM), but I still need the role?”
  - “How do I become a Training Manager?”
  - “How do I know who my Approving Officer (AO) is?”
  - “How do I request an extension for my Training Manager account?”
  - “How do I view & select my Training Managers (TM)?”
- The user then clicks the most relevant question to expand its full answer.

#### 3. Reports

Triggers when the text contains `report` or `reports` as a word.

Behavior:
- Resets `unknownAreaCount`.
- Bot says:
  - “Here's a MarineNet Training Manager report topic that might help:”
- Shows a single option:
  - “I'm the MarineNet Training Manager (TM) for my Unit. How do I run a MarineNet Report?”
- Clicking it expands the TM report FAQ.

#### 4. Courses & Testing (quick reply)

If the text contains “courses & testing” (from the quick reply):
- Resets `unknownAreaCount`.
- Bot says: “Got it, let's look at courses and testing related topics.”
- Calls `showRootMenu()` so the user can choose a category manually (e.g., Courses/Curricula, Testing).

### Direct FAQ Matching

The chat also has a **keyword → FAQ mapping** (`DIRECT_FAQ_KEYWORDS`) used to suggest specific FAQs directly. Examples:

- `"training manager"`:
  - Suggests all Training Manager–related FAQs (same list as above).
- `"tm role"`:
  - Focuses on role request/requirements FAQs.

Flow:
- `findDirectFaqMatches(text)` builds a list of FAQs whose mapped phrase appears in the user text.
- If there are matches:
  - Resets `unknownAreaCount`.
  - Bot says either:
    - “I found one FAQ that looks related:” or
    - “I found some FAQs that look related:”
  - Renders each FAQ as a clickable option.
  - Clicking opens the FAQ via `showFaq(faq.id)`.

### Category Detection

If no special-case or direct FAQ match is found, the bot uses `CATEGORY_KEYWORDS` to guess a decision-tree **category** node:

Examples:
- `account-management-menu`:
  - `password`, `login`, `log in`, `username`, `user name`, `account`, `security question`, `unlock`, `locked`, `disabled`.
- `questionmark-menu`:
  - `questionmark`, `assessment`, `quiz`, `authoring`.
- `self-study-courseware-development-menu`:
  - `self paced`, `self-paced`, `courseware`, `content development`.
- `adobe-connect-menu`:
  - `adobe`, `connect`, `meeting`, `vle`, `virtual`, `host account`, `seminar`.

Algorithm:
- Count how many keywords from each category appear in the message.
- Pick the category with the highest score (if any).
- Ask the user to confirm:
  - “It sounds like you need help with ACCOUNT MANAGEMENT. Is that right?”
  - Options: **Yes** (go to that category menu), **No, show all options** (fall back to root menu).

---

## Fallback & Escalation Behavior

### Root Menu Presentation

`showRootMenu()`:
- Displays:
  - “Here are a few common areas I can help with:”
- Shows **featured categories** first (or first 3 categories if not found):
  - `ACCOUNT MANAGEMENT`
  - `COURSES/CURRICULA`
  - `TESTING`
- Clicking a category shows that category’s FAQ topics.

### Unknown Queries & Helpdesk Escalation

If:
- There is **no** help/helpdesk special case.
- There is **no** RUC or report handling.
- No direct FAQ matches.
- No category detection match.

Then:
- The bot says: “I'm not sure which area that is yet.”
- Increments `unknownAreaCount`.
- If `unknownAreaCount` < 3:
  - Calls `showRootMenu()` to give the user categories to choose from.
- If `unknownAreaCount` reaches 3:
  - Resets `unknownAreaCount`.
  - Calls `showHelpdeskOptions()` with a more explicit escalatory message:
    - “I'm having trouble understanding exactly what you need. If you'd like more help, you can either submit a trouble ticket or contact the MarineNet Help Desk:”
  - Shows the same pair of options as the help/helpdesk intent:
    - Submit Trouble Ticket (opens the portal).
    - Contact Help Desk (shows phone-number FAQ).

This ensures that after three unsuccessful attempts, the chatbot **escalates to human support paths** rather than looping indefinitely.

---

## Navigation Controls

### Back

The **Back** button:
- If currently viewing a FAQ and there is a `lastMenuNodeId`, it:
  - Says: “Okay, here are the other topics in that area:”
  - Re-renders that category’s topics.
- Else, if `historyStack` has entries:
  - Pops the previous node ID.
  - Says: “Going back.”
  - If previous is `root`:
    - Shows the root menu.
  - Otherwise:
    - Shows the corresponding category menu.
- Else:
  - Indicates we’re at the top:
    - “You're already at the top level. Here are the main areas again:”
    - Shows root menu.

### Main Menu

The **Main menu** button:
- Says: “Back to the main menu.”
- Clears `historyStack`, `lastMenuNodeId`, `pendingCategoryNodeId`, and `currentNodeId`.
- Calls `showRootMenu()`.

---

## Extensibility & Future Work

### Adding New Targeted Intents

To add a new “smart intent” (like RUCs or reports), the pattern is:

1. Identify relevant FAQs and note their IDs in `faqs.json`.
2. In `faq-chat-demo.html`:
   - Extend `DIRECT_FAQ_KEYWORDS` to map new phrases to those FAQ IDs, **or**
   - Add a new block in `handleUserText` that:
     - Checks for a regex or keyword.
     - Builds a small set of FAQ `optionModels`.
     - Calls `appendBot(...)` and `appendOptions(...)`.

### Updating FAQ Content

When MarineNet updates the FAQ page:

1. Save the new HTML as `marinenet-faq-raw.html`.
2. Run:

   ```bash
   python3 parse_faqs.py
   ```

3. Optionally, copy updated JSON from `faqs.json` and `decision_tree.json` into `FAQS_DATA` and `DECISION_TREE` in `faq-chat-demo.html` if you want the demo page to stay in sync.

(In a production setup, the chat frontend would typically **fetch** JSON instead of embedding it.)

### Integration into a Larger System

This demo is designed to be easily integrated:
- The **core logic** can be extracted into a small JS module:
  - Accepts `faqs` and `decisionTree` as inputs.
  - Exposes functions like:
    - `startConversation()`
    - `handleUserUtterance(text)`
    - Callbacks for “render bot message” / “render options”.
- A real application (React, Vue, Angular, or a server-rendered app) can then:
  - Supply its own rendering layer.
  - Optionally log metrics, track flows, or add authentication gates around certain FAQs.

---

## How to Use This Project

### For Developers

- To **inspect or change scraping**:
  - Edit `parse_faqs.py`.
  - Re-run it after saving the latest `marinenet-faq-raw.html`.

- To **tweak chat behavior or styling**:
  - Work in `faq-chat-demo.html`:
    - CSS in `<style>` for look & feel.
    - JS in `<script>` for routing and special cases.

- To **test locally**:
  - Open `faq-chat-demo.html` directly in a modern browser.
  - Try sample prompts:
    - “I forgot my password.”
    - “training manager help”
    - “rucs”
    - “reports”
    - “help” or “helpdesk”.

### For Project Managers / Stakeholders

- The repo demonstrates:
  - How a **non-LLM, rules-based chatbot** can provide value using existing FAQ content.
  - How to separate **content** (JSON) from **conversation flow** (decision tree).
  - How to add **low-risk intent handling** (keyword-based) for important flows like:
    - Account issues.
    - Training Manager actions.
    - Helpdesk escalation.
- The current demo is suitable as:
  - An internal prototype.
  - A reference implementation for a future production UI.



