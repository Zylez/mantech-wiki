/* =====================================================================
   Very Cool Anarchy Server — front-end script
   - Fetches live server status and renders it
   - Fetches announcements and collapses long ones behind "Read more"
   - Fetches recent server activity and renders it with icons + relative
     timestamps
   ===================================================================== */

// ---- Config -----------------------------------------------------------

const API_BASE = 'https://man.servegame.com/api';
const STATUS_ENDPOINT   = `${API_BASE}/minecraft-status`;
const ACTIVITY_ENDPOINT = `${API_BASE}/discord-activity`;

// Any announcement whose visible text exceeds this length gets collapsed
// behind a "Read more" toggle. Tune to taste.
const ANNOUNCEMENT_PREVIEW_CHARS = 220;

// ---- Utilities --------------------------------------------------------

/** Escape a string for safe use as HTML text content. */
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
        // Iterate over a snapshot because we may remove children
        [...node.childNodes].forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (!allowedTags.has(child.tagName)) {
                    // Replace disallowed element with its text content
                    const text = document.createTextNode(child.textContent);
                    child.replaceWith(text);
                    return;
                }
                // Strip all attributes except href/title on links
                [...child.attributes].forEach(attr => {
                    if (child.tagName === 'A' && (attr.name === 'href' || attr.name === 'title')) {
                        // Only allow http(s) and relative links
                        if (attr.name === 'href') {
                            const v = attr.value.trim();
                            const isSafe = /^(https?:|mailto:|\/|#)/i.test(v);
                            if (!isSafe) child.removeAttribute('href');
                        }
                    } else {
                        child.removeAttribute(attr.name);
                    }
                });
                // Ensure external links open safely
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

/** Approximate visible-text length of an HTML string. */
function textLength(html) {
    const div = document.createElement('div');
    div.innerHTML = String(html ?? '');
    return (div.textContent || '').trim().length;
}

/**
 * Split HTML content into a short preview + a remainder. The preview is
 * taken from the first paragraph/line-break boundary that fits under the
 * character budget; if none exists, it's taken from a raw text cut.
 */
function splitForPreview(html, budget) {
    const container = document.createElement('div');
    container.innerHTML = String(html ?? '');
    // Walk top-level children until we exceed the budget
    const previewNodes = [];
    let charCount = 0;
    for (const node of [...container.childNodes]) {
        const text = (node.textContent || '').trim();
        if (charCount + text.length > budget && previewNodes.length > 0) {
            // We already have some preview; stop here
            break;
        }
        previewNodes.push(node.cloneNode(true));
        charCount += text.length;
        if (charCount >= budget) break;
    }
    const previewDiv = document.createElement('div');
    previewNodes.forEach(n => previewDiv.appendChild(n));

    // Figure out what remains
    const remainderDiv = container.cloneNode(true);
    // Remove the first `previewNodes.length` top-level children from remainder
    for (let i = 0; i < previewNodes.length; i++) {
        if (remainderDiv.firstChild) remainderDiv.removeChild(remainderDiv.firstChild);
    }
    return {
        preview:   previewDiv.innerHTML,
        remainder: remainderDiv.innerHTML.trim()
    };
}

/** Convert an ISO date into a friendly relative string. */
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
    // For older messages, show the actual date
    return new Date(iso).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric'
    });
}

/**
 * Classify an activity message into one of our icon categories based on
 * its content. Keyword matching is intentionally loose — anything the
 * server sends about players entering/leaving/dying will still land in
 * a sensible bucket.
 */
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
    const wrapper = document.createElement('div');
    wrapper.className = `admonition ${type} announcement`;

    // If the content fits within the preview budget, render it inline.
    if (textLength(safeContent) <= ANNOUNCEMENT_PREVIEW_CHARS) {
        wrapper.innerHTML = `
            <p class="admonition-title">${title}</p>
            <div class="announcement-preview">${safeContent}</div>
        `;
        return wrapper;
    }

    // Otherwise split it into a visible preview + a collapsible remainder.
    const { preview, remainder } = splitForPreview(safeContent, ANNOUNCEMENT_PREVIEW_CHARS);
    wrapper.innerHTML = `
        <p class="admonition-title">${title}</p>
        <div class="announcement-preview">${preview}</div>
        <details class="announcement-full">
            <summary aria-label="Toggle full announcement"></summary>
            <div class="announcement-full-body">${remainder}</div>
        </details>
    `;
    return wrapper;
}

function renderAnnouncements(list, container) {
    container.innerHTML = '';
    if (!Array.isArray(list) || list.length === 0) return;
    list.forEach(item => container.appendChild(renderAnnouncement(item)));
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
                renderAnnouncements(data.announcements, announcementDiv);
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
//
// We support both the standard DOMContentLoaded event AND MkDocs
// Material's `navigation.instant` mode. In instant mode, page swaps
// happen without full reloads, so we hook into Material's subscribable
// document$ observable when it's available. Otherwise we fall back to
// DOMContentLoaded.

function boot() {
    getServerStatus();
    loadDiscordActivity();
}

if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(() => boot());
} else {
    document.addEventListener('DOMContentLoaded', boot);
}
