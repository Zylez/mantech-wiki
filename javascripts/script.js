/* =====================================================================
   Very Cool Anarchy Server / Very Cool Cobblemon Server
   Front-end script

   - Fetches live server status and renders it
   - Fetches announcements: each is a title-collapsible; the whole
     section also has a "Collapse all / Expand all" toggle
   - Fetches recent server activity and renders it with icons + relative
     timestamps
   - On the Install page (cobblemon branch): fetches modlist.html from
     the site's assets folder, parses it, and renders a filterable list
     of mods with CurseForge / Modrinth badges
   ===================================================================== */

// ---- Config -----------------------------------------------------------

const API_BASE = 'https://man.servegame.com/api';
const STATUS_ENDPOINT   = `${API_BASE}/minecraft-status`;
const ACTIVITY_ENDPOINT = `${API_BASE}/discord-activity`;

// Announcements shorter than this render pre-expanded so quick notices
// don't force an extra click; long ones start collapsed.
const ANNOUNCEMENT_AUTO_OPEN_CHARS = 220;

// ---- Utilities --------------------------------------------------------

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

/**
 * Sanitize announcement HTML so we can safely render server-provided
 * content. Allows a small whitelist of tags and strips everything else.
 */
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

// ---- Modlist (Install page) -------------------------------------------
//
// The Install page can contain an element like:
//     <div id="mod-list"
//          data-modlist-src="https://man.servegame.com/api/modlist"></div>
//
// The script fetches that URL, expects the JSON shape produced by the
// Pi's /api/modlist route:
//     { status, mods: [{ id, name, url, note? }], total, cached, ... }
// classifies each entry's URL by host (CurseForge / Modrinth / GitHub /
// other), and renders a searchable, compact chip layout. Mods without
// a URL render as a static chip whose `note` shows as a tooltip.
// On any page without #mod-list, this function is a no-op.

/** Classify a mod link by its host domain. Returns null when no URL. */
function classifyModHost(url) {
    if (!url) return { kind: 'nolink', label: 'No download link', short: '—' };
    try {
        const host = new URL(url, window.location.origin).hostname.replace(/^www\./, '');
        if (host.endsWith('curseforge.com')) return { kind: 'curseforge', label: 'CurseForge', short: 'CF' };
        if (host.endsWith('modrinth.com'))   return { kind: 'modrinth',   label: 'Modrinth',   short: 'MR' };
        if (host.endsWith('github.com'))     return { kind: 'github',     label: 'GitHub',     short: 'GH' };
        return { kind: 'other', label: 'Other', short: '?' };
    } catch (e) {
        return { kind: 'other', label: 'Other', short: '?' };
    }
}

/** Normalize an API mod entry into a display-ready object. */
function normalizeModEntry(mod) {
    const name = (mod.name || mod.id || '').trim();
    const url  = typeof mod.url === 'string' ? mod.url.trim() : null;
    const note = typeof mod.note === 'string' ? mod.note.trim() : null;
    return { name, url: url || null, note, ...classifyModHost(url) };
}

/** Render the modlist into the target container as compact chips. */
function renderModlist(container, entries, meta) {
    container.innerHTML = '';

    if (entries.length === 0) {
        container.innerHTML = `
            <p class="modlist-empty">
                No mods returned by the API. If you're the admin, check the
                server logs and the SSH extractor.
            </p>
        `;
        return;
    }

    // Header row: total count, breakdown by source, cache indicator
    const total = entries.length;
    const breakdown = entries.reduce((acc, e) => {
        acc[e.kind] = (acc[e.kind] || 0) + 1;
        return acc;
    }, {});
    const breakdownParts = [];
    if (breakdown.curseforge) breakdownParts.push(`${breakdown.curseforge} CurseForge`);
    if (breakdown.modrinth)   breakdownParts.push(`${breakdown.modrinth} Modrinth`);
    if (breakdown.github)     breakdownParts.push(`${breakdown.github} GitHub`);
    if (breakdown.other)      breakdownParts.push(`${breakdown.other} other`);
    if (breakdown.nolink)     breakdownParts.push(`${breakdown.nolink} no link`);

    const controls = document.createElement('div');
    controls.className = 'modlist-controls';
    controls.innerHTML = `
        <label class="modlist-search-wrap">
            <span class="modlist-search-icon" aria-hidden="true">🔍</span>
            <input type="search" class="modlist-search"
                   placeholder="Filter mods…" autocomplete="off">
        </label>
        <span class="modlist-count" data-total="${total}">
            ${total} mods
        </span>
    `;
    container.appendChild(controls);

    if (breakdownParts.length > 0) {
        const subtitle = document.createElement('div');
        subtitle.className = 'modlist-subtitle';
        const cachedLabel = meta && meta.cached ? ' · cached' : '';
        subtitle.textContent = `${breakdownParts.join(' · ')}${cachedLabel}`;
        container.appendChild(subtitle);
    }

    // The chip list itself
    const list = document.createElement('ul');
    list.className = 'modlist-items';
    for (const entry of entries) {
        const li = document.createElement('li');
        li.className = `modlist-item modlist-item--${entry.kind}`;
        li.dataset.name = entry.name.toLowerCase();

        const badge = `<span class="modlist-badge" aria-label="${escapeHtml(entry.label)}" title="${escapeHtml(entry.label)}">${escapeHtml(entry.short)}</span>`;
        const nameSpan = `<span class="modlist-name">${escapeHtml(entry.name)}</span>`;
        const noteAttr = entry.note ? ` title="${escapeHtml(entry.note)}"` : '';

        if (entry.url) {
            li.innerHTML = `
                <a class="modlist-link" href="${escapeHtml(entry.url)}"
                   target="_blank" rel="noopener noreferrer"${noteAttr}>
                    ${badge}${nameSpan}
                </a>
            `;
        } else {
            // No download link: render as a static chip with the note as tooltip
            li.innerHTML = `
                <span class="modlist-link modlist-link--static"${noteAttr}>
                    ${badge}${nameSpan}
                </span>
            `;
            if (entry.note) {
                const noteEl = document.createElement('span');
                noteEl.className = 'modlist-note-indicator';
                noteEl.setAttribute('aria-hidden', 'true');
                noteEl.textContent = 'ⓘ';
                li.querySelector('.modlist-link').appendChild(noteEl);
            }
        }

        list.appendChild(li);
    }
    container.appendChild(list);

    // Filter wiring
    const search = controls.querySelector('.modlist-search');
    const count  = controls.querySelector('.modlist-count');
    const items  = [...list.querySelectorAll('.modlist-item')];
    const applyFilter = () => {
        const q = search.value.trim().toLowerCase();
        let visible = 0;
        for (const li of items) {
            const match = !q || li.dataset.name.includes(q);
            li.style.display = match ? '' : 'none';
            if (match) visible++;
        }
        count.textContent = q ? `${visible} of ${total} mods` : `${total} mods`;
    };
    search.addEventListener('input', applyFilter);
}

function loadModlist() {
    const container = document.getElementById('mod-list');
    if (!container) return;

    const src = container.dataset.modlistSrc;
    if (!src) {
        container.innerHTML = '<p class="modlist-error">Missing <code>data-modlist-src</code> attribute.</p>';
        return;
    }

    container.innerHTML = '<p class="modlist-loading">Loading mod list…</p>';

    fetch(src)
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
        .then(data => {
            if (!data || data.status === 'error') {
                throw new Error((data && data.message) || 'API returned error');
            }
            const rawMods = Array.isArray(data.mods) ? data.mods : [];
            const entries = rawMods.map(normalizeModEntry)
                                    .filter(e => e.name);
            // Sort alphabetically (the API also sorts, but re-sort defensively)
            entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
            renderModlist(container, entries, { cached: !!data.cached });
        })
        .catch(err => {
            container.innerHTML = `
                <p class="modlist-error">
                    Couldn't load the mod list (${escapeHtml(err.message)}).
                    The AutoModpack methods above still work without it.
                </p>
            `;
            console.error('Modlist error:', err);
        });
}

// ---- Bootstrapping ----------------------------------------------------

function boot() {
    getServerStatus();
    loadDiscordActivity();
    loadModlist();
}

if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(() => boot());
} else {
    document.addEventListener('DOMContentLoaded', boot);
}
