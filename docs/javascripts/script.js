/* =====================================================================
   Very Cool Cobblemon Server — front-end script
   - Live server status
   - Live activity feed with icons + relative timestamps
   - Announcements: title-collapsible + section-level Collapse/Expand all
   - Mod list: parses docs/assets/modlist.html into an
     alphabetized, filterable grid of CurseForge/Modrinth links
   ===================================================================== */

// ---- Config -----------------------------------------------------------

const API_BASE = 'https://man.servegame.com/api';
const STATUS_ENDPOINT   = `${API_BASE}/minecraft-status`;
const ACTIVITY_ENDPOINT = `${API_BASE}/discord-activity`;

const ANNOUNCEMENT_AUTO_OPEN_CHARS = 220;

// ---- Utilities --------------------------------------------------------

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

function sanitizeAnnouncementHtml(html) {
    const allowedTags = new Set([
        'B', 'STRONG', 'I', 'EM', 'U', 'BR', 'P', 'UL', 'OL', 'LI',
        'A', 'CODE', 'PRE', 'SPAN', 'DIV', 'H1', 'H2', 'H3', 'H4',
        'H5', 'H6', 'BLOCKQUOTE', 'HR'
    ]);
    const template = document.createElement('template');
    template.innerHTML = String(html ?? '');
    const walk = (node) => {
        [...node.childNodes].forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (!allowedTags.has(child.tagName)) {
                    const text = document.createTextNode(child.textContent);
                    child.replaceWith(text);
                    return;
                }
                [...child.attributes].forEach(attr => {
                    if (child.tagName === 'A' && (attr.name === 'href' || attr.name === 'title')) {
                        if (attr.name === 'href') {
                            const v = attr.value.trim();
                            const isSafe = /^(https?:|mailto:|\/|#)/i.test(v);
                            if (!isSafe) child.removeAttribute('href');
                        }
                    } else {
                        child.removeAttribute(attr.name);
                    }
                });
                if (child.tagName === 'A' && child.getAttribute('href')) {
                    child.setAttribute('rel', 'noopener noreferrer');
                    child.setAttribute('target', '_blank');
                }
                walk(child);
            }
        });
    };
    walk(template.content);
    return template.innerHTML;
}

function textLength(html) {
    const div = document.createElement('div');
    div.innerHTML = String(html ?? '');
    return (div.textContent || '').trim().length;
}

function formatRelativeTime(iso) {
    const ts = new Date(iso).getTime();
    if (Number.isNaN(ts)) return '';
    const diff = Date.now() - ts;
    const sec = Math.round(diff / 1000);
    if (sec < 45)   return 'just now';
    const min = Math.round(sec / 60);
    if (min < 60)   return `${min}m ago`;
    const hr  = Math.round(min / 60);
    if (hr < 24)    return `${hr}h ago`;
    const day = Math.round(hr / 24);
    if (day === 1)  return 'yesterday';
    if (day < 7)    return `${day}d ago`;
    return new Date(iso).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
    });
}

function classifyActivity(content) {
    const t = (content || '').toLowerCase();
    if (/(joined|connected|logged in|has entered)/.test(t))   return { kind: 'join',   icon: '↗' };
    if (/(left|disconnected|logged out|has quit)/.test(t))    return { kind: 'leave',  icon: '↘' };
    if (/(died|was killed|was slain|drowned|blew up|fell)/.test(t))
                                                              return { kind: 'death',  icon: '☠' };
    if (/(said|:|whispered|<)/.test(t))                       return { kind: 'chat',   icon: '💬' };
    return { kind: 'system', icon: '★' };
}

// ---- Announcements ----------------------------------------------------

function renderAnnouncement(item) {
    const type   = item.type || 'note';
    const title  = escapeHtml(item.title || 'Announcement');
    const safeContent = sanitizeAnnouncementHtml(item.content || '');

    const details = document.createElement('details');
    details.className = `admonition ${type} announcement`;
    if (textLength(safeContent) <= ANNOUNCEMENT_AUTO_OPEN_CHARS) {
        details.setAttribute('open', '');
    }

    details.innerHTML = `
        <summary class="admonition-title announcement-summary">
            <span class="announcement-summary-text">${title}</span>
            <span class="announcement-summary-chevron" aria-hidden="true"></span>
        </summary>
        <div class="announcement-body">${safeContent}</div>
    `;
    return details;
}

function renderAnnouncementsSection(list, container) {
    container.innerHTML = '';
    container.classList.remove('is-empty');
    if (!Array.isArray(list) || list.length === 0) {
        container.classList.add('is-empty');
        return;
    }

    const header = document.createElement('div');
    header.className = 'announcements-header';
    header.innerHTML = `
        <span class="announcements-count">
            ${list.length} active announcement${list.length === 1 ? '' : 's'}
        </span>
        <button type="button" class="announcements-toggle-all" data-mode="collapse">
            Collapse all
        </button>
    `;
    container.appendChild(header);

    const listEl = document.createElement('div');
    listEl.className = 'announcements-list';
    list.forEach(item => listEl.appendChild(renderAnnouncement(item)));
    container.appendChild(listEl);

    const toggle = header.querySelector('.announcements-toggle-all');
    const setMode = (mode) => {
        toggle.dataset.mode = mode;
        toggle.textContent = mode === 'collapse' ? 'Collapse all' : 'Expand all';
    };
    const anyOpen = () => listEl.querySelectorAll('details.announcement[open]').length > 0;
    setMode(anyOpen() ? 'collapse' : 'expand');
    toggle.addEventListener('click', () => {
        const mode = toggle.dataset.mode;
        const detailsEls = listEl.querySelectorAll('details.announcement');
        if (mode === 'collapse') {
            detailsEls.forEach(d => d.removeAttribute('open'));
            setMode('expand');
        } else {
            detailsEls.forEach(d => d.setAttribute('open', ''));
            setMode('collapse');
        }
    });

    listEl.addEventListener('toggle', () => {
        setMode(anyOpen() ? 'collapse' : 'expand');
    }, true);
}

// ---- Server status ----------------------------------------------------

function renderServerStatus(data, statusDiv) {
    if (data && data.online) {
        statusDiv.innerHTML = `
            <ul class="status-online-grid">
                <li>
                    <span class="status-label">Status</span>
                    <span class="status-value">
                        <span class="status-dot status-dot--online"></span>
                        Online
                    </span>
                </li>
                <li>
                    <span class="status-label">Players online</span>
                    <span class="status-value">${escapeHtml(String(data.player_count ?? '—'))}</span>
                </li>
                <li>
                    <span class="status-label">IP</span>
                    <span class="status-value"><code>${escapeHtml(data.server_ip ?? '—')}</code></span>
                </li>
                <li>
                    <span class="status-label">Version</span>
                    <span class="status-value">${escapeHtml(data.version ?? '—')}</span>
                </li>
            </ul>
        `;
    } else {
        statusDiv.innerHTML = `
            <div class="status-offline">
                <span class="status-dot status-dot--offline"></span>
                <span>Server is offline</span>
            </div>
        `;
    }
}

function getServerStatus() {
    const statusDiv       = document.getElementById('serverstatus');
    const announcementDiv = document.getElementById('announcement');
    if (!statusDiv) return;

    fetch(STATUS_ENDPOINT)
        .then(r => r.json())
        .then(data => {
            if (announcementDiv) {
                renderAnnouncementsSection(data.announcements, announcementDiv);
            }
            renderServerStatus(data, statusDiv);
        })
        .catch(err => {
            statusDiv.innerHTML = `
                <div class="status-offline">
                    <span class="status-dot status-dot--offline"></span>
                    <span>Error fetching server status</span>
                </div>
            `;
            console.error('Server status error:', err);
        });
}

// ---- Activity feed ----------------------------------------------------

function renderActivityMessage(message) {
    const { kind, icon } = classifyActivity(message.content);
    const el = document.createElement('div');
    el.className = 'activity-message';
    el.innerHTML = `
        <span class="activity-icon activity-icon--${kind}" aria-hidden="true">${icon}</span>
        <div class="activity-content">${escapeHtml(message.content)}</div>
        <div class="activity-timestamp" title="${escapeHtml(new Date(message.timestamp).toLocaleString())}">
            ${escapeHtml(formatRelativeTime(message.timestamp))}
        </div>
    `;
    return el;
}

function loadDiscordActivity() {
    const messagesContainer = document.getElementById('discord-messages');
    const countContainer    = document.getElementById('discord-count');
    if (!messagesContainer) return;

    fetch(ACTIVITY_ENDPOINT)
        .then(r => r.json())
        .then(data => {
            if (data && data.status === 'success' && Array.isArray(data.messages) && data.messages.length > 0) {
                if (countContainer) {
                    countContainer.textContent = `${data.count ?? data.messages.length} recent events`;
                }
                messagesContainer.innerHTML = '';
                data.messages.forEach(m => messagesContainer.appendChild(renderActivityMessage(m)));
            } else {
                messagesContainer.innerHTML = '<p class="activity-empty">No recent activity yet.</p>';
                if (countContainer) countContainer.textContent = '0 events';
            }
        })
        .catch(err => {
            messagesContainer.innerHTML = '<p class="activity-empty">Error loading activity.</p>';
            if (countContainer) countContainer.textContent = 'Error';
            console.error('Activity error:', err);
        });
}

// ---- Mod list ---------------------------------------------------------
//
// Populates any element with class="mod-list" and a data-source attribute
// pointing at an HTML file that follows the CurseForge modlist.html
// export format:
//
//   <ul><li><a href="...">Mod Name</a></li>...</ul>
//
// Multiple <a> per <li> or nested lists are handled: we grab every <a>
// under any <li>. Blank names or non-http hrefs are filtered out.

function parseModList(html) {
    const parser = new DOMParser();
    // The exported file is a fragment (no <html>/<body>); parseFromString
    // wraps it automatically so querySelectorAll still works.
    const doc = parser.parseFromString(String(html ?? ''), 'text/html');
    const links = [...doc.querySelectorAll('li a[href]')];
    const seen = new Set();
    const mods = [];
    for (const a of links) {
        const name = (a.textContent || '').trim();
        const url  = a.getAttribute('href').trim();
        if (!name || !url) continue;
        if (!/^https?:\/\//i.test(url)) continue;
        // Dedupe by URL (same mod listed twice = ignore repeat)
        if (seen.has(url)) continue;
        seen.add(url);
        mods.push({ name, url });
    }
    // Alphabetical, case-insensitive, locale-aware (handles accents nicely)
    mods.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    return mods;
}

function renderModListGrid(container, mods) {
    if (mods.length === 0) {
        container.innerHTML = `
            <p class="mod-list-empty">
                No mods listed yet. Once <code>modlist.html</code> is populated,
                mods will appear here automatically.
            </p>`;
        return;
    }

    container.innerHTML = `
        <div class="mod-list-toolbar">
            <input type="search"
                   class="mod-list-filter"
                   placeholder="Filter mods…"
                   aria-label="Filter mods by name">
            <span class="mod-list-count" aria-live="polite">${mods.length} mods</span>
        </div>
        <div class="mod-list-grid" role="list">
            ${mods.map(m => `
                <a class="mod-link"
                   role="listitem"
                   href="${escapeHtml(m.url)}"
                   target="_blank"
                   rel="noopener noreferrer"
                   data-search="${escapeHtml(m.name.toLowerCase())}">
                    <span class="mod-link-name">${escapeHtml(m.name)}</span>
                    <span class="mod-link-arrow" aria-hidden="true">↗</span>
                </a>
            `).join('')}
        </div>
    `;

    // Wire up the filter
    const input = container.querySelector('.mod-list-filter');
    const count = container.querySelector('.mod-list-count');
    const items = [...container.querySelectorAll('.mod-link')];
    const total = mods.length;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
            items.forEach(el => el.hidden = false);
            count.textContent = `${total} mods`;
            return;
        }
        let visible = 0;
        for (const el of items) {
            const match = el.dataset.search.includes(q);
            el.hidden = !match;
            if (match) visible++;
        }
        count.textContent = `${visible} of ${total}`;
    });
}

function loadModList(container) {
    const sourceUrl = container.dataset.source;
    if (!sourceUrl) return;
    container.innerHTML = '<p class="mod-list-loading">Loading mod list…</p>';
    fetch(sourceUrl)
        .then(r => {
            if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
            return r.text();
        })
        .then(html => {
            const mods = parseModList(html);
            renderModListGrid(container, mods);
        })
        .catch(err => {
            container.innerHTML = `
                <p class="mod-list-error">
                    Mod list unavailable. If you're the site admin,
                    check that <code>${escapeHtml(sourceUrl)}</code> exists and is reachable.
                </p>`;
            console.error('Mod list error:', err);
        });
}

function initModLists() {
    document.querySelectorAll('.mod-list[data-source]').forEach(loadModList);
}

// ---- Bootstrapping ----------------------------------------------------

function boot() {
    getServerStatus();
    loadDiscordActivity();
    initModLists();
}

if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(() => boot());
} else {
    document.addEventListener('DOMContentLoaded', boot);
}
