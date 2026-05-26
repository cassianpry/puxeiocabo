# Arcade Redesign: Puxei o Cabo

**North Star:** Arcade Cabinet — dark, neon-lit, vibrant. Like walking into a Brazilian arcade at night.

## Palette

### Base escura (fundo de cabinet)
| Token | Value | Usage |
|---|---|---|
| `deep-canvas` | `oklch(0.10 0.02 260)` | Page background |
| `dark-ash` | `oklch(0.16 0.03 260)` | Cards, elevated surfaces |
| `muted-stone` | `oklch(0.22 0.04 260)` | Popover, hover surfaces |

### Cores que estouram (SF6-inspired)
| Token | Value | Usage |
|---|---|---|
| `arcade-blue` | `oklch(0.60 0.22 235)` | Primary buttons, links, interactive elements, focus rings |
| `arcade-yellow` | `oklch(0.78 0.2 85)` | Secondary highlights, badges, warnings |
| `arcade-pink` | `oklch(0.58 0.24 350)` | Destructive actions, rejected states |

### Texto
| Token | Value | Usage |
|---|---|---|
| `snow-text` | `oklch(0.96 0.01 260)` | Primary text |
| `dusk-text` | `oklch(0.65 0.03 260)` | Secondary/muted text |

### Semânticas
| Token | Value | Usage |
|---|---|---|
| `success` | `oklch(0.65 0.2 145)` | Approved/confirmed |
| `warning` | `oklch(0.7 0.2 65)` | Warning states |
| `destructive` | `oklch(0.58 0.24 350)` | Destructive actions (replaced red) |
| `border` | `oklch(0.35 0.08 260)` | Borders, dividers |

## Typography
- **Headings**: `Archivo Black`, sans-serif, uppercase
- **Body**: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI"`)

## Components

### Buttons
- **Primary**: arcade-blue bg, deep-canvas text, `box-shadow` glow on hover (0 0 16px arcade-blue / 0.5)
- **Outline**: arcade-blue border, transparent bg, arcade-blue text, filled on hover
- **Destructive**: arcade-pink bg, white text, pink glow on hover
- **Ghost/Link**: arcade-blue text

### Cards
- dark-ash background, border oklch(0.35 0.08 260), 2px arcade-blue top border
- `hover:translateY(-2px)` + `hover:shadow-[0_4px_20px_oklch(0.60_0.22_235_/_0.15)]`

### Badges
- **pending**: arcade-yellow bg + deep-canvas text
- **approved**: success green (oklch(0.65 0.2 145)) + white text
- **rejected**: arcade-pink bg + white text
- **deleted**: outline style

### Header
- deep-canvas bg, 2px arcade-blue bottom border
- Nav links: dusk-text, arcade-blue on hover

### Focus rings
- 3px arcade-blue @ 50% opacity, `focus-visible:ring-[3px]`

## Motion
- **Hit-flash**: arcade-blue overlay (was white)
- **Neon pulse**: `@keyframes neon-glow` for status indicators
- **Page transitions**: existing (200ms fade+slide-up)
- **Card stagger**: existing (60ms per card)
- **Hover glow**: arcade-blue shadow on interactive elements

## Anti-patterns (kept from original)
- No gradient text
- No glassmorphism
- No box-shadows at rest (only glow on hover/focus)
- No em dashes
- pt-BR language
- System fonts for body
