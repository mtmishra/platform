# LeapMoney Design System — Document Index

Production-authoritative design specifications. All Figma and frontend work references these documents.

## Reading Order

| Order | Document | Purpose |
|---|---|---|
| 1 | [Phase2A_Research_Foundation](LeapMoney_Phase2A_Research_Foundation_V1.docx) | Product DNA, personas, UX principles, business goals |
| 2 | [Phase2B_Design_Matrix](LeapMoney_Phase2B_Design_Matrix_V1.docx) | Competitor analysis, best-of-breed feature decisions |
| 3 | [Phase2C_Design_Direction](LeapMoney_Phase2C_Design_Direction_V1.docx) | Final approved design decisions — colour, type, layout |
| 4 | [Sprint2_Design_System](LeapMoney_Sprint2_Design_System_V1.docx) | 55-component Figma design system — tokens, variants, states |
| 5 | [Sprint3A_Website_UI_Spec](LeapMoney_Sprint3A_Website_UI_Spec_V1.docx) | All marketing website screen specs (MW-01 to MW-14+) |
| 6 | [Sprint3A1_Visual_Design_Direction](LeapMoney_Sprint3A1_Visual_Design_Direction_V1.docx) | Section-by-section visual specs for MW-01 Homepage |
| 7 | [Sprint3A2_MW01_Wireframe_Blueprint](LeapMoney_Sprint3A2_MW01_Wireframe_Blueprint_V1.docx) | Low-fi wireframes + developer notes for homepage |

## Key Decisions (Phase 2C — Final)

- **Brand:** Navy (#0B244E) + Leap Blue (#2563EB) + Mist (#F4F6FA)
- **Type:** Inter Variable (headings + body) + JetBrains Mono (numbers)
- **Homepage:** 11 sections in fixed order (Nav → Hero → Trust → Score → Match → How → Testimonials → AI Dark → Lenders → CTA → Footer)
- **No stock photography** — real LeapMoney UI components ARE the illustrations
- **55 Figma components** across Atoms (18) + Molecules (14) + Organisms (13) + Templates (10)

## Implementation Gap (Sprint 3A)

`apps/web` homepage currently has an interactive LeapScore demo. Sprint 3A rebuilds it to the 11-section marketing spec above.
