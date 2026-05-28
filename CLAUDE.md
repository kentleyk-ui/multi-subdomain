# Multi-Subdomain Management Interface

## Default Theme: Glass Morphism

**All new pages must use the glass morphism theme unless explicitly directed otherwise.**

### Theme Details
- **Location**: `lib/theme.js`
- **Exports**: `S` (styles object), `METAL` (button function), `METAL_SM` (small button function), `PILL` (pill button function)
- **Usage**: 
  ```javascript
  import { S, METAL, METAL_SM, PILL } from "@/lib/theme";
  ```

### Design Characteristics
- **Background**: Dark gradient (#070d1a → #0a1425 → #050810)
- **Text Color**: Cyan (#81d4fa) with blue accents (#4fc3f7)
- **Cards**: Semi-transparent (rgba) with backdrop blur effect (10px)
- **Inputs**: Transparent backgrounds (rgba) with 4px blur
- **Buttons**: Liquid metal gradient with inset shadows
- **Effects**: 
  - Glowing text shadows on titles/labels
  - Transparent borders with rgba
  - Smooth transitions (0.2s)
  - Status indicators: Green (ok), Red (error), Yellow (checking)

### Color Palette
| Element | Color | Hex/RGBA |
|---------|-------|---------|
| Background | Dark Gradient | #070d1a / #0a1425 |
| Primary Text | Cyan | #81d4fa |
| Accent | Light Blue | #4fc3f7 |
| Meta Text | Dark Blue | #2a6a9a |
| Success | Green | #4caf50 |
| Error | Red | #ef5350 |
| Warning | Yellow | #ffd700 |
| Card BG | Transparent Dark | rgba(10, 18, 32, 0.4) |
| Input BG | Transparent Dark | rgba(5, 13, 26, 0.6) |

### API Endpoints (Phase 2 Complete)
- `/api/list-subdomains` - List all subdomains with pagination
- `/api/create-multi` - Create multiple subdomains via Cloudflare + Vercel
- `/api/delete-multi` - Delete subdomains
- `/api/save-subdomain-desc` - Save subdomain descriptions
- `/api/list-pages` - List pages for a subdomain
- `/api/create-page` - Create/update pages with version tracking
- `/api/delete-page` - Delete pages
- `/api/page-versions` - Manage version history and rollbacks
- `/api/activity-logs` - Track all user actions (audit trail)
- `/api/check-ssl` - Validate SSL certificates for domains
- `/api/auto-backup` - Create automated backups with metadata
- `/api/get-stats` - Dashboard statistics
- `/api/templates` - Pre-built page templates (4 types)
- `/api/clone-subdomain` - Clone subdomain with all pages
- `/api/duplicate-page` - Duplicate individual pages

### Features Implemented
1. **Phase 1**: Subdomain listing, descriptions, delete confirmation, sorting, search
2. **Phase 2**: 
   - Activity logs with audit trail
   - SSL certificate validation and monitoring
   - Page version history with rollback capability
   - Auto-backup with snapshots
   - Pre-built templates (welcome, contact, blog, about)
   - Dashboard statistics
   - Visual editor helpers
   - Page management with CRUD operations
   - Pagination (5/10/15/20 items per page)

### Important Notes
- All cards use `backdropFilter: "blur()"` for glass morphism
- Transparent colors use `rgba()` with alpha values (0.4-0.7)
- Icons use emojis: 🔄 refresh, 📊 stats, 📋 logs, 🔒 SSL, 💾 backups, 📁 versions
- No legacy solid backgrounds - maintain transparency throughout
- Glow effects use text-shadow and box-shadow with reduced opacity
