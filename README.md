# LOFIS

React + Vite app rebuilt from the Figma **`lofis`** page in [ACM-SPRING-PROJECT-LOFIS](https://www.figma.com/design/VANzrhrtDlhGrsmaTlosLb/ACM-SPRING-PROJECT-LOFIS).

> The Figma page is named **`lofis`** (not “hifis”). All frames below are on that page.

## Frames on the `lofis` page

| Node ID | Frame name | Route |
|---------|------------|-------|
| `1:3` | Masha - Map/Home Screen | `/map` |
| `1:4` | Bonnie - Bulletin Board | `/bulletin` |
| `14:208` | Bonnie - Bulletin Board (filters) | `/bulletin/filters` |
| `14:298` | Bonnie - Bulletin Board / verified club view | `/bulletin/create` |
| `14:342` | Bonnie - Bulletin Board / verified club view | `/bulletin/editor` |
| `14:399` | Bonnie - Bulletin Board / verified club view | `/bulletin/publish` |
| `1:2` | Erin - Acc Profile/Club Attendance | `/profile` |
| `7:2` | Erin - Calendar | `/calendar` |
| `13:643` | Erin - Calendar (stacked events) | `/calendar/stacked` |
| `13:443` | Erin - Calendar (day) | `/calendar/day` |
| `13:480` | Erin - Calendar (day detail) | `/calendar/day/detail` |

## Run

```bash
npm install
npm run dev
```

Phone frame: **390×844px**. Bottom nav: **Map · Pin · Profile**.

- **Student** — save events from the map; list on profile
- **Organizer** — **+** on bulletin → create → editor → publish
- **Map** — Leaflet + OpenStreetMap centered on UCSD
