/* =====================================================================
   Very Cool Anarchy Server — front-end script
   - Fetches live server status and renders it
   - Fetches announcements: each is a title-collapsible; the whole
     section also has a "Collapse all / Expand all" toggle
   - Fetches recent server activity and renders it with icons + relative
     timestamps
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
 * content. Allows a small whitelist of tags (formatting + links + line
 * breaks) and strips everything else.
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
//
// Each announcement renders as a <details> element styled like a Material
// admonition. The <summary> row is always visible and shows the title +
// a subtle open/close chevron. Clicking it toggles the body.
//
// The whole announcements section also gets a header with a
// "Collapse all / Expand all" button so returning visitors can hide the
// whole block in a single click.

function renderAnnouncement(item) {
    const type   = item.type || 'note';
    const title  = escapeHtml(item.title || 'Announcement');
    const safeContent = sanitizeAnnouncementHtml(item.content || '');

    const details = document.createElement('details');
    details.className = `admonition ${type} announcement`;
    // Short announcements start expanded — long ones start collapsed
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

    // Section header — count + collapse/expand all
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

    // List
    const listEl = document.createElement('div');
    listEl.className = 'announcements-list';
    list.forEach(item => listEl.appendChild(renderAnnouncement(item)));
    container.appendChild(listEl);

    // Wire up the section-level toggle
    const toggle = header.querySelector('.announcements-toggle-all');
    const setMode = (mode) => {
        toggle.dataset.mode = mode;
        toggle.textContent = mode === 'collapse' ? 'Collapse all' : 'Expand all';
    };
    // Initial mode reflects reality: if any announcement is open, offer "Collapse all"
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

    // Also keep the toggle label in sync if the user opens/closes individual items
    listEl.addEventListener('toggle', () => {
        setMode(anyOpen() ? 'collapse' : 'expand');
    }, true); // capture phase — <details>'s toggle event does not bubble
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

// ---- Bootstrapping ----------------------------------------------------

function boot() {
    getServerStatus();
    loadDiscordActivity();
}

if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(() => boot());
} else {
    document.addEventListener('DOMContentLoaded', boot);
}
