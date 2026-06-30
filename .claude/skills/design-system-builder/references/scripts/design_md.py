"""
Pre-render DESIGN.md from template + all design decisions provided by AI.

Fills everything: theme name, mode, density, surfaces, brands, fonts, type scale,
spacing, component classes, do/don't rules, layout, similar brands.
No <!-- AI: ... --> markers are left in the output — all slots must be in the input.

Usage:
    python design_md.py \
      --input '{ ... }' \
      --output design/web/{theme}/DESIGN.md \
      --template path/to/DESIGN.md   # optional

Full input JSON schema:
{
  "theme_name":    "forge",
  "theme_mode":    "dark",
  "density":       "compact",
  "philosophy":    "Precision over decoration — function defines form, data leads hierarchy",
  "narrative":     "4–6 sentence paragraph describing the design character...",
  "fonts": {
    "sans":       "Inter",
    "serif":      "Sora",
    "mono":       "JetBrains Mono",
    "rationale":  "Sora was chosen for its geometric clarity...",
    "substitute": "Nunito, system-ui, sans-serif"
  },
  "surfaces": [
    { "name": "Carbon",   "hex": "0E0E0F", "token": "bg-background-primary",   "role": "Main page background" },
    { "name": "Obsidian", "hex": "141416", "token": "bg-background-secondary",  "role": "Generic elevated surface" },
    { "name": "Slate",    "hex": "141416", "token": "bg-card",                  "role": "Cards, stat blocks" },
    { "name": "Gunmetal", "hex": "1A1A1D", "token": "bg-sidebar",               "role": "Sidebar nav container" },
    { "name": "Iron",     "hex": "2A2A2E", "token": "border-border-primary",    "role": "All borders and dividers" },
    { "name": "Steel",    "hex": "3A3A3F", "token": "border-border-secondary",  "role": "Stronger emphasis borders, focus rings" }
  ],
  "brands": [
    { "role": "Primary",    "name": "Iron Red",   "hex": "E53935", "prefix": "primary-*",    "role_desc": "Main CTA, active states, data callouts" },
    { "role": "Secondary",  "name": "Steel Blue", "hex": "1E88E5", "prefix": "secondary-*",  "role_desc": "Supporting actions, chart series 2" },
    { "role": "Tertiary",   "name": "Amber",      "hex": "FFB300", "prefix": "tertiary-*",   "role_desc": "Warning-adjacent highlights, chart series 3" },
    { "role": "Quaternary", "name": "Copper",     "hex": "F4511E", "prefix": "quaternary-*", "role_desc": "Chart series 4, heat indicators" },
    { "role": "Quinary",    "name": "Jade",       "hex": "43A047", "prefix": "quinary-*",    "role_desc": "Chart series 5, categorical grouping" }
  ],
  "type_scale": [
    { "role": "Caption / badge",  "token": "text-label-sm", "size_px": 11, "weight": "font-regular",  "leading": "leading-snug"    },
    { "role": "Label",            "token": "text-label-md", "size_px": 12, "weight": "font-medium",   "leading": "leading-snug"    },
    { "role": "Body small",       "token": "text-body-sm",  "size_px": 13, "weight": "font-regular",  "leading": "leading-normal"  },
    { "role": "Body",             "token": "text-body-lg",  "size_px": 14, "weight": "font-regular",  "leading": "leading-relaxed" },
    { "role": "Subheading",       "token": "text-h6",       "size_px": 15, "weight": "font-semibold", "leading": "leading-snug"    },
    { "role": "Heading small",    "token": "text-h5",       "size_px": 18, "weight": "font-semibold", "leading": "leading-tight"   },
    { "role": "Heading",          "token": "text-h4",       "size_px": 22, "weight": "font-bold",     "leading": "leading-tight"   },
    { "role": "Metric",           "token": "text-h2",       "size_px": 30, "weight": "font-bold",     "leading": "leading-tight"   },
    { "role": "Display",          "token": "text-display",  "size_px": 60, "weight": "font-bold",     "leading": "leading-none"    }
  ],
  "leading_display": "leading-tight",
  "leading_body":    "leading-relaxed",
  "spacing": {
    "page_max_width":      "7xl",
    "section_gap":         "6",
    "card_header":         "px-4 py-3",
    "card_body":           "px-4 py-4",
    "card_footer":         "px-4 py-3",
    "element_gap":         "3",
    "sidebar_expanded_px": 240,
    "sidebar_collapsed_px": 56
  },
  "components": {
    "primary_button":  { "padding": "px-4 py-2",   "note": "Rounded corners match global radius rule." },
    "border_button":   { "padding": "px-4 py-2",   "note": "Hover darkens border and text slightly." },
    "ghost_button":    { "note": "Hover applies bg-primary-soft." },
    "segmented":       { "padding": "px-3 py-1.5", "radius_note": "No radius — square corners only." },
    "panel_card":      { "header": "px-4 py-3", "body": "px-4 py-4", "footer": "px-4 py-3",
                         "shadow_note": "No shadow — elevation via background tone only." },
    "data_table":      { "alternating_note": "No alternating row colors — use row hover only." },
    "sidebar":         { "expanded_px": 240, "collapsed_px": 56 },
    "tab_bar":         { "padding": "py-2", "gap": "gap-6", "style_note": "Underline style only — no pill variants." },
    "header":          { "height": "h-14" },
    "input":           { "padding": "px-3 py-2" }
  },
  "dos": [
    "Use `font-semibold` and `font-bold` exclusively for hierarchy — never font size alone.",
    "No radius on any element — square corners are the system rule.",
    "Use Lucide icons at 18px for structural controls, 20px for standalone actions.",
    "Limit to two background tones per view: canvas + card only.",
    "All interactive elements must show hover + focus states using `transition-colors duration-150`."
  ],
  "donts": [
    "Don't round any corner — not even inputs, badges, or tooltips.",
    "Don't mix typefaces — one font family only throughout the entire system.",
    "Don't use box-shadow on cards — depth comes from background color steps only."
  ],
  "layout_paragraph": "5–8 sentence paragraph...",
  "layout_max_width": "7xl",
  "similar_brands": [
    { "product": "Linear", "trait": "Dense sidebar nav, high type weight contrast, no decorative color." },
    { "product": "Vercel Dashboard", "trait": "Flat dark surfaces, monochrome baseline with single accent." },
    { "product": "Grafana", "trait": "Data-first layout, minimal chrome, strong semantic color discipline." },
    { "product": "PagerDuty", "trait": "Alert hierarchy through weight and state color, not decoration." }
  ]
}
"""

import argparse
import json
import re
import sys
from pathlib import Path

SCRIPT_DIR  = Path(__file__).parent
DEFAULT_TPL = SCRIPT_DIR.parent / "template" / "DESIGN.md"
DEFAULT_OUT = "DESIGN.md"


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def _strip_instruction_blocks(text: str) -> str:
    text = re.sub(r"\{INSTRUCTION:[^}]*\}", "", text, flags=re.DOTALL)
    lines = text.splitlines()
    cleaned, prev_blank = [], False
    for line in lines:
        is_blank = line.strip() == ""
        if is_blank and prev_blank:
            continue
        cleaned.append(line)
        prev_blank = is_blank
    return "\n".join(cleaned)


def _strip_checklist_comment(text: str) -> str:
    return re.sub(r"<!--\s*\nGENERATION CHECKLIST.*?-->", "", text, flags=re.DOTALL)


def _req(cfg: dict, *keys: str) -> str:
    """Walk nested keys, raise with clear message if missing."""
    val = cfg
    for k in keys:
        if not isinstance(val, dict) or k not in val:
            raise KeyError(f"Missing required input field: {'.'.join(keys)}")
        val = val[k]
    return str(val)


def _get(cfg: dict, *keys, default: str = "") -> str:
    val = cfg
    for k in keys:
        if not isinstance(val, dict) or k not in val:
            return default
        val = val[k]
    return str(val) if val is not None else default


# ---------------------------------------------------------------------------
# section renderers
# ---------------------------------------------------------------------------

def render_header(cfg: dict) -> str:
    theme_display = cfg["theme_name"].replace("-", " ").title()
    philosophy    = _req(cfg, "philosophy")
    narrative     = _req(cfg, "narrative")
    mode          = _req(cfg, "theme_mode")
    return (
        f"# {theme_display} — Style Reference\n"
        f"> {philosophy}\n\n"
        f"**Theme:** {mode}\n\n"
        f"{narrative}\n"
    )


def render_surface_table(surfaces: list) -> str:
    rows = []
    for s in surfaces:
        name    = s.get("name", "—")
        hex_val = f"`#{s['hex']}`" if s.get("hex") else "—"
        rows.append(f"| {name} | {hex_val} | `{s['token']}` | {s['role']} |")
    return (
        "| Name | Hex (info) | Tailwind Token | Role |\n"
        "|------|-----------|----------------|------|\n"
    ) + "\n".join(rows)


def render_brand_table(brands: list) -> str:
    rows = []
    for b in brands:
        name    = b.get("name", "—")
        hex_val = f"`#{b['hex']}`" if b.get("hex") else "—"
        rows.append(f"| {b['role']} | {name} | {hex_val} | `{b['prefix']}` | {b['role_desc']} |")
    return (
        "| Brand | Name | Base Hex (info) | Token Prefix | Role |\n"
        "|-------|------|----------------|--------------|------|\n"
    ) + "\n".join(rows)


def render_font_tokens(fonts: dict) -> str:
    sans  = fonts.get("sans",  "—")
    serif = fonts.get("serif", "—")
    mono  = fonts.get("mono",  "—")
    return (
        "| Token | Font | Digunakan untuk |\n"
        "|-------|------|-----------------|\n"
        f"| `font-sans`  | {sans}  | Body, UI copy, labels, inputs |\n"
        f"| `font-serif` | {serif} | Display, h1–h4, stat numbers |\n"
        f"| `font-mono`  | {mono}  | Code, data values, timestamps |"
    )


def render_type_scale(rows: list) -> str:
    header = (
        "| Role | Size Token | Size | Weight Token | Line Height Token |\n"
        "|------|-----------|------|--------------|-------------------|\n"
    )
    lines = []
    for r in rows:
        lines.append(
            f"| {r['role']} | `{r['token']}` | {r['size_px']}px "
            f"| `{r['weight']}` | `{r['leading']}` |"
        )
    return header + "\n".join(lines)


def render_similar_brands(brands: list) -> str:
    return "\n".join(f"- **{b['product']}** — {b['trait']}" for b in brands)


# ---------------------------------------------------------------------------
# main transform
# ---------------------------------------------------------------------------

def transform(template: str, cfg: dict) -> str:
    out = template

    # 1. Strip boilerplate
    out = _strip_checklist_comment(out)
    out = _strip_instruction_blocks(out)

    sp = cfg.get("spacing", {})
    co = cfg.get("components", {})
    fonts = cfg.get("fonts", {})

    # 2. Header block
    out = re.sub(
        r"^# \{THEME_NAME\}.*?---\n",
        render_header(cfg) + "\n---\n",
        out, count=1, flags=re.DOTALL,
    )

    # 3. Theme mode / density fallback
    out = re.sub(r"\{light \| dark \| system\}", cfg.get("theme_mode", "light"), out)
    out = re.sub(r"\{compact \| comfortable \| airy\}", cfg.get("density", "comfortable"), out)

    # 4. Surface table
    out = re.sub(
        r"(### Surface\n)(.*?)(\n### Brand)",
        lambda m: m.group(1) + "\n" + render_surface_table(cfg.get("surfaces", [])) + "\n" + m.group(3),
        out, flags=re.DOTALL,
    )

    # 5. Brand table
    new_brand_table = render_brand_table(cfg.get("brands", []))
    out = re.sub(
        r"(\| Brand \| Name \|.*?\n\|[-| :]+\|\n)(\| Primary.*?)(\n\nToken usage pattern)",
        lambda m: new_brand_table + m.group(3),
        out, flags=re.DOTALL,
    )

    # 6. Font family tokens table
    out = re.sub(
        r"(\| Token \| Font \| Digunakan untuk \|\n\|[-| ]+\|\n)(.*?)(\n\n### Type Scale)",
        lambda m: render_font_tokens(fonts) + m.group(3),
        out, flags=re.DOTALL,
    )

    # 7. Font heading + rationale
    rationale = fonts.get("rationale", "")
    serif_name = fonts.get("serif", fonts.get("sans", "—"))
    out = re.sub(
        r"### \{FONT_FAMILY\} — \{ONE_SENTENCE_TYPEFACE_RATIONALE\}",
        f"### {serif_name} — {rationale}",
        out,
    )

    # 8. Font substitute
    substitute = fonts.get("substitute", "system-ui, sans-serif")
    out = re.sub(
        r"- \*\*Substitute:\*\* \{GOOGLE_FONTS_OR_SYSTEM_FALLBACK\}",
        f"- **Substitute:** {substitute}",
        out,
    )

    # 9. Body base size from type scale
    body_row = next((r for r in cfg.get("type_scale", []) if r.get("token") == "text-body-lg"), None)
    body_px  = str(body_row["size_px"]) if body_row else "14"
    out = re.sub(r"`text-body-lg` \(\{PX\}px\)", f"`text-body-lg` ({body_px}px)", out)

    # 10. Leading placeholders in typography section
    leading_display = cfg.get("leading_display", "leading-tight")
    leading_body    = cfg.get("leading_body", "leading-relaxed")
    out = re.sub(r"\{leading-\*[^}]*display[^}]*\}", leading_display, out)
    out = re.sub(r"\{leading-\*[^}]*body[^}]*\}", leading_body, out)
    out = re.sub(r"\{leading-\*[^}]*\}", leading_display, out)  # fallback

    # 11. Type scale table
    if cfg.get("type_scale"):
        out = re.sub(
            r"(\| Role \| Size Token \| Size \| Weight Token \| Line Height Token \|\n\|[-| ]+\|\n)(.*?)(\n\n---)",
            lambda m: render_type_scale(cfg["type_scale"]) + m.group(3),
            out, flags=re.DOTALL,
        )

    # 12. Spacing section values
    page_max = sp.get("page_max_width", "7xl")
    out = re.sub(r"max-w-\{SIZE\}", f"max-w-{page_max}", out)
    out = re.sub(r"- \*\*Section gap:\*\* `gap-\{N\}`",
                 f"- **Section gap:** `gap-{sp.get('section_gap', '6')}`", out)
    out = re.sub(r"card header \(`px-\{N\} py-\{N\}`\)",
                 f"card header (`{sp.get('card_header', 'px-4 py-3')}`)", out)
    out = re.sub(r"card body \(`px-\{N\} py-\{N\}`\)",
                 f"card body (`{sp.get('card_body', 'px-4 py-4')}`)", out)
    out = re.sub(r"- \*\*Element gap:\*\* `gap-\{N\}`",
                 f"- **Element gap:** `gap-{sp.get('element_gap', '3')}`", out)
    sidebar_exp = sp.get("sidebar_expanded_px", co.get("sidebar", {}).get("expanded_px", 240))
    sidebar_col = sp.get("sidebar_collapsed_px", co.get("sidebar", {}).get("collapsed_px", 56))
    out = re.sub(r"- \*\*Sidebar width:\*\* \{PX\}px expanded / \{PX\}px collapsed",
                 f"- **Sidebar width:** {sidebar_exp}px expanded / {sidebar_col}px collapsed", out)

    # 13. Component classes — primary button
    pb = co.get("primary_button", {})
    pb_pad  = pb.get("padding", "px-4 py-2")
    pb_note = pb.get("note", "")
    out = re.sub(
        r"`bg-primary text-font-on-accent font-sans text-body-sm font-semibold px-\{N\} py-\{N\}`",
        f"`bg-primary text-font-on-accent font-sans text-body-sm font-semibold {pb_pad}`",
        out,
    )
    out = re.sub(r"Hover → `hover:bg-primary-bold`\. \{ADDITIONAL_NOTES\}",
                 f"Hover → `hover:bg-primary-bold`. {pb_note}", out)

    # 14. Border button
    bb = co.get("border_button", {})
    bb_pad  = bb.get("padding", "px-4 py-2")
    bb_note = bb.get("note", "")
    out = re.sub(
        r"`bg-background-primary border border-border-primary text-font-primary px-\{N\} py-\{N\}`",
        f"`bg-background-primary border border-border-primary text-font-primary {bb_pad}`",
        out,
    )
    out = re.sub(r"\{BEHAVIORAL_NOTE\}", bb_note, out, count=1)

    # 15. Ghost button
    gb_note = co.get("ghost_button", {}).get("note", "")
    out = re.sub(r"`text-primary` — no background, no border\. \{BEHAVIORAL_NOTE\}",
                 f"`text-primary` — no background, no border. {gb_note}", out)

    # 15b. Destructive button — reuse primary button padding
    out = re.sub(
        r"`bg-error text-font-primary px-\{N\} py-\{N\}`",
        f"`bg-error text-font-primary {pb_pad}`",
        out,
    )

    # 16. Segmented button
    sg = co.get("segmented", {})
    sg_pad  = sg.get("padding", "px-3 py-1.5")
    sg_rnote = sg.get("radius_note", "")
    out = re.sub(
        r"Base \(inactive\): `px-\{N\} py-\{N\} text-label-sm font-medium border border-border-primary text-font-secondary`",
        f"Base (inactive): `{sg_pad} text-label-sm font-medium border border-border-primary text-font-secondary`",
        out,
    )
    out = re.sub(
        r"Active: `px-\{N\} py-\{N\} text-label-sm font-semibold border border-primary bg-primary text-font-on-accent`",
        f"Active: `{sg_pad} text-label-sm font-semibold border border-primary bg-primary text-font-on-accent`",
        out,
    )
    out = re.sub(r"\{RADIUS_NOTE\}", sg_rnote, out)

    # 17. Panel card
    pc = co.get("panel_card", {})
    out = re.sub(r"Card header: `px-\{N\} py-\{N\}`",
                 f"Card header: `{pc.get('header', 'px-4 py-3')}`", out)
    out = re.sub(r"Card body: `px-\{N\} py-\{N\}`",
                 f"Card body: `{pc.get('body', 'px-4 py-4')}`", out)
    out = re.sub(r"Card footer: `px-\{N\} py-\{N\} border-t border-border-primary`",
                 f"Card footer: `{pc.get('footer', 'px-4 py-3')} border-t border-border-primary`", out)
    out = re.sub(r"\{SHADOW_NOTE\}", pc.get("shadow_note", ""), out)

    # 18. Data table
    out = re.sub(r"\{ALTERNATING_ROW_NOTE\}",
                 co.get("data_table", {}).get("alternating_note", ""), out)

    # 19. Sidebar component
    sb = co.get("sidebar", {})
    sb_exp = sp.get("sidebar_expanded_px", sb.get("expanded_px", 240))
    sb_col = sp.get("sidebar_collapsed_px", sb.get("collapsed_px", 56))
    out = re.sub(
        r"`bg-sidebar border-r border-border-primary` — fixed width \{PX\}px \(collapsed: \{PX\}px icon-only\)",
        f"`bg-sidebar border-r border-border-primary` — fixed width {sb_exp}px (collapsed: {sb_col}px icon-only)",
        out,
    )

    # 20. Tab bar
    tb = co.get("tab_bar", {})
    out = re.sub(r"Spacing: `py-\{N\} gap-\{N\}`",
                 f"Spacing: `{tb.get('padding', 'py-2')} {tb.get('gap', 'gap-6')}`", out)
    out = re.sub(r"\{TAB_STYLE_NOTE:[^}]*\}", tb.get("style_note", "Underline style only."), out)

    # 21. Header height
    hdr_height = co.get("header", {}).get("height", "h-14")
    out = re.sub(
        r"`bg-background-secondary border-b border-border-primary h-\{N\}`",
        f"`bg-background-secondary border-b border-border-primary {hdr_height}`",
        out,
    )

    # 22. Input padding
    inp_pad = co.get("input", {}).get("padding", "px-3 py-2")
    out = re.sub(
        r"`bg-background-secondary border border-border-primary px-\{N\} py-\{N\} font-sans text-body-lg font-regular text-font-primary placeholder:text-font-placeholder`",
        f"`bg-background-secondary border border-border-primary {inp_pad} font-sans text-body-lg font-regular text-font-primary placeholder:text-font-placeholder`",
        out,
    )

    # 23. Do rules (variable slots only — fixed rules stay)
    dos_extra = cfg.get("dos", [])
    if dos_extra:
        dos_replacements = {
            r"\{TYPOGRAPHY_HIERARCHY_RULE\}": dos_extra[0] if len(dos_extra) > 0 else "",
            r"\{RADIUS_RULE[^}]*\}":          dos_extra[1] if len(dos_extra) > 1 else "",
            r"\{ICON_USAGE_RULE\}":            dos_extra[2] if len(dos_extra) > 2 else "",
            r"\{SURFACE_STACK_RULE[^}]*\}":    dos_extra[3] if len(dos_extra) > 3 else "",
        }
        for pattern, value in dos_replacements.items():
            out = re.sub(pattern, value, out)

    # 24. Don't rules
    donts_extra = cfg.get("donts", [])
    if donts_extra:
        dont_replacements = {
            r"\{RADIUS_DONT[^}]*\}":   donts_extra[0] if len(donts_extra) > 0 else "",
            r"\{TYPEFACE_DONT\}":       donts_extra[1] if len(donts_extra) > 1 else "",
            r"\{SHADOW_DONT\}":         donts_extra[2] if len(donts_extra) > 2 else "",
        }
        for pattern, value in dont_replacements.items():
            out = re.sub(pattern, value, out)

    # 25. Layout paragraph + max-width
    layout_para = cfg.get("layout_paragraph", "")
    layout_mw   = cfg.get("layout_max_width", sp.get("page_max_width", "7xl"))
    out = re.sub(r"\{LAYOUT_PARAGRAPH\}", layout_para, out)
    out = re.sub(r"max-w-\{SIZE\} mx-auto", f"max-w-{layout_mw} mx-auto", out)

    # 26. Similar brands
    similar = cfg.get("similar_brands", [])
    if similar:
        new_similar = render_similar_brands(similar)
        out = re.sub(
            r"(## Similar Brands\n\n)((?:- \*\*\{PRODUCT\}\*\* — \{SHARED_TRAIT\}\n?)+)",
            lambda m: m.group(1) + new_similar + "\n",
            out,
        )

    # 27. Catch-all: any remaining {PLACEHOLDER} not already handled
    def _fallback_placeholder(m):
        inner = m.group(1).strip()
        if re.search(r"\{|\}", inner):
            return m.group(0)
        label = re.sub(r"[_—\-]+", " ", inner).lower().strip()
        return f"[{label}]"

    out = re.sub(r"\{([^{}]+)\}", _fallback_placeholder, out)

    # 28. Collapse 3+ blank lines
    out = re.sub(r"\n{3,}", "\n\n", out)

    return out.strip() + "\n"


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description="Render DESIGN.md from full AI-provided token decisions.")
    ap.add_argument("--input",    required=True, help="JSON string or @path/to/file.json")
    ap.add_argument("--output",   default=DEFAULT_OUT, help="Output path for DESIGN.md")
    ap.add_argument("--template", default=str(DEFAULT_TPL), help="Template path")
    args = ap.parse_args()

    raw = args.input
    if raw.startswith("@"):
        cfg = json.loads(Path(raw[1:]).read_text())
    else:
        cfg = json.loads(raw)

    tpl_path = Path(args.template)
    if not tpl_path.exists():
        print(f"Template not found: {tpl_path}", file=sys.stderr)
        sys.exit(1)
    template = tpl_path.read_text(encoding="utf-8")

    result = transform(template, cfg)

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(result, encoding="utf-8")
    print(f"Written: {out_path}")


if __name__ == "__main__":
    main()
