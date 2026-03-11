# WordPress Fleet Dashboard (Starter)

This repository now includes a starter implementation for a **centralized WordPress management dashboard** that can be hosted on your Hostinger server and used to monitor WordPress installations hosted on your 20i reseller account.

## Suggested subdomain (<=4 characters)

Recommended subdomain: **`dash.complexelite.com`**

Other valid options:
- `wp.complexelite.com`
- `ctrl.complexelite.com`
- `hub.complexelite.com`

## What is included

A lightweight dashboard UI with:
- Row-based layout (one row per website)
- Live screenshot thumbnails in the Site Name column
- Auto-refresh for screenshots every 10 minutes (and on manual refresh)
- CSV export for all rows
- "Login as Admin" icon button per row (single sign-on URL placeholder)
- Clickable site links
- Status and monitoring columns including:
  - Site Name
  - WordPress Version
  - SSL Status
  - Users
  - PHP Version
  - Status (Online/Offline)
  - HTTP Code
  - Uptime %
  - Last Backup
  - Plugin Updates
  - Core Updates
  - Theme Updates
  - Disk Usage
  - Response Time
  - Last Checked

## Project structure

- `dashboard/index.html` – table layout and controls
- `dashboard/styles.css` – responsive row/table styling
- `dashboard/app.js` – data rendering, CSV export, screenshot refresh
- `dashboard/data/sites.json` – sample source data for sites

## Implementation roadmap for production

1. Build a secure API service on Hostinger (Node.js/PHP/Laravel) that:
   - Stores your WordPress site inventory.
   - Polls each site every few minutes for version, plugin updates, SSL, and uptime.
   - Saves snapshots to a database (MySQL/PostgreSQL).

2. Add authentication:
   - Admin-only login to dashboard.
   - Role-based access if you later add staff.

3. Add WordPress connection strategy per site:
   - Preferred: dedicated WP plugin + signed API key per install.
   - Alternative: WP REST API + Application Passwords.
   - Advanced: WP-CLI over SSH if access is available.

4. Implement secure "Login as Admin" flow:
   - Each WP install gets an endpoint for one-time signed login tokens.
   - Dashboard calls endpoint and opens wp-admin in a new tab.
   - Token expires quickly and is single-use.

5. Screenshot service:
   - Use a screenshot worker (Playwright/Puppeteer) to capture above-the-fold image.
   - Cache images and refresh every 10 minutes.
   - Current starter uses WordPress mShots URL as a simple no-server baseline.

6. Alerting:
   - Email/Slack alerts for downtime, SSL expiry, high response time, PHP incompatibility, failed backups.

## Local preview

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/dashboard/
```
