# GlobalConvert - Smart Currency Converter

## 1. Project Overview

- **Project Name**: GlobalConvert
- **Project Type**: Single-page web application (multi-view SPA)
- **Core Functionality**: Real-time currency conversion with live exchange rates, conversion history, and dark/light mode
- **Target Users**: Travelers, traders, and anyone needing quick currency conversions

## 2. UI/UX Specification

### Layout Structure

**Navigation Bar (Fixed Top)**
- Logo/Brand name on left
- Navigation links: Home, Live Rates
- Dark/Light mode toggle on right

**Main Content Area**
- Full viewport height minus navbar
- Centered content container (max-width: 900px)

**Footer**
- Simple copyright text
- API attribution

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette - Light Mode**
- Background: `#f8fafc` (slate-50)
- Card Background: `#ffffff`
- Primary: `#0ea5e9` (sky-500)
- Primary Hover: `#0284c7` (sky-600)
- Secondary: `#64748b` (slate-500)
- Accent: `#10b981` (emerald-500)
- Text Primary: `#1e293b` (slate-800)
- Text Secondary: `#64748b` (slate-500)
- Border: `#e2e8f0` (slate-200)
- Success: `#22c55e` (green-500)
- Error: `#ef4444` (red-500)

**Color Palette - Dark Mode**
- Background: `#0f172a` (slate-900)
- Card Background: `#1e293b` (slate-800)
- Primary: `#38bdf8` (sky-400)
- Primary Hover: `#0ea5e9` (sky-500)
- Secondary: `#94a3b8` (slate-400)
- Accent: `#34d399` (emerald-400)
- Text Primary: `#f1f5f9` (slate-100)
- Text Secondary: `#94a3b8` (slate-400)
- Border: `#334155` (slate-700)

**Typography**
- Font Family: 'DM Sans', sans-serif (Google Fonts)
- Headings: 700 weight
  - H1: 2.5rem
  - H2: 1.75rem
  - H3: 1.25rem
- Body: 400 weight, 1rem
- Small: 0.875rem

**Spacing System**
- Base unit: 0.5rem (8px)
- Padding small: 0.5rem
- Padding medium: 1rem
- Padding large: 1.5rem
- Gap: 1rem
- Border radius: 12px

**Visual Effects**
- Card shadow (light): `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
- Card shadow (dark): `0 4px 6px -1px rgba(0, 0, 0, 0.4)`
- Transitions: 0.3s ease for all interactive elements
- Subtle hover lift on cards: translateY(-2px)

### Components

**1. Currency Input Card**
- From currency dropdown with flag icons
- Amount input field (number)
- Swap button (animated rotate on click)
- To currency dropdown with flag icons
- Converted amount display (large, prominent)

**2. Currency Dropdown**
- Search/filter input
- Scrollable list of currencies
- Each item: Flag + Currency Code + Currency Name
- Selected state highlight

**3. Live Rates Table**
- Sortable columns: Currency, Rate, Change (24h)
- Color-coded change (green up, red down)
- Refresh button
- Loading skeleton states

**4. Conversion History Panel**
- Collapsible sidebar or bottom section
- List of recent conversions
- Each entry: From → To, Amount, Result, Timestamp
- Clear history button
- Max 20 entries stored in localStorage

**5. Mode Toggle**
- Sun/Moon icon toggle
- Smooth transition between modes
- Persists preference in localStorage

## 3. Functionality Specification

### Core Features

**Currency Conversion**
- Support 30+ major currencies (USD, INR, EUR, GBP, JPY, CAD, AUD, CHF, CNY, etc.)
- Real-time conversion using free API
- Instant calculation on input change
- Swap currencies functionality

**Exchange Rate API**
- Primary: ExchangeRate-API (free tier)
- Fallback: Use cached rates if API fails
- Auto-refresh rates every 10 minutes on Live Rates page

**Live Rates Page**
- Display all supported currencies vs USD (base)
- Show 24-hour change percentage
- Sort by currency name or change percentage
- Last updated timestamp

**Conversion History**
- Store last 20 conversions
- Each entry: timestamp, fromCurrency, toCurrency, amount, result
- Persist in localStorage
- Clear all history option

**Dark/Light Mode**
- Default: Follow system preference
- Manual toggle overrides system preference
- Persist choice in localStorage
- Smooth transition animation

### User Interactions

1. **Select Currency**: Click dropdown → Search/select → Update conversion
2. **Enter Amount**: Type number → Instant conversion result
3. **Swap Currencies**: Click swap button → Animated swap → Recalculate
4. **View Live Rates**: Navigate to Live Rates → See all rates
5. **Toggle Mode**: Click sun/moon → Theme switches smoothly
6. **View History**: See recent conversions automatically saved

### Edge Cases
- Invalid amount input: Show 0 or keep previous
- API failure: Show cached rates with warning
- Same currency conversion: Show 1:1 with message
- Empty history: Show "No conversions yet" message
- Very large numbers: Format with commas, limit to 2 decimals

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Navigation bar displays correctly with logo, links, and mode toggle
- [ ] Currency converter card is centered and well-structured
- [ ] Dropdowns show flag icons and currency codes
- [ ] Dark/Light mode transitions smoothly without flicker
- [ ] Live rates table is readable and properly aligned
- [ ] History panel shows clear, readable entries
- [ ] Mobile responsive: elements stack properly on small screens

### Functional Checkpoints
- [ ] Currency conversion works for all supported currencies
- [ ] Swap button exchanges from/to currencies correctly
- [ ] Live rates display current exchange rates
- [ ] Mode toggle switches theme and persists preference
- [ ] Conversion history saves automatically
- [ ] History persists after page refresh
- [ ] All animations are smooth (no jank)
- [ ] Error states handled gracefully

### Technical Checkpoints
- [ ] No console errors on page load
- [ ] API calls succeed (or fallback works)
- [ ] localStorage operations work correctly
- [ ] Page loads in under 3 seconds
