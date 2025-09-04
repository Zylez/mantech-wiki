<div id="announcement"></div>

# Server Fundamentals

## Basic Information

- **Type**: Vanilla → PaperMC server with plugins  
- **Version**: 1.21.8 (24/7)  
- **Online-Mode**: OFF → Cracked clients supported  
- **World Type**: Unrestricted wilderness (build/mine/PvP everywhere)  

## Server Status

<div id="serverstatus">
    <p><b>Checking server status...</b></p>
</div>

<div id="discord-activity-container">
    <div class="discord-header">
        <span class="discord-title">Recent Server Activity</span>
        <span class="discord-count" id="discord-count">Loading...</span>
    </div>
    <div class="discord-messages" id="discord-messages">
        <p>Loading Discord activity...</p>
    </div>
</div>

<style>
.discord-activity-container {
    border: 1px solid var(--md-default-fg-color--lightest);
    border-radius: 8px;
    margin: 1.5rem 0;
    overflow: hidden;
}

.discord-header {
    background-color: var(--md-primary-fg-color);
    color: white;
    padding: 0.8rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.discord-title {
    font-weight: 600;
}

.discord-count {
    font-size: 0.9rem;
    opacity: 0.9;
}

.discord-messages {
    max-height: 300px;
    overflow-y: auto;
    padding: 0.5rem;
    background-color: var(--md-default-bg-color);
}

.discord-message {
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid var(--md-default-fg-color--lightest);
    font-size: 0.9rem;
    line-height: 1.4;
}

.discord-message:last-child {
    border-bottom: none;
}

.discord-timestamp {
    color: var(--md-default-fg-color--light);
    font-size: 0.8rem;
    margin-bottom: 0.2rem;
}

/* Scrollbar styling */
.discord-messages::-webkit-scrollbar {
    width: 6px;
}

.discord-messages::-webkit-scrollbar-track {
    background: var(--md-default-bg-color);
}

.discord-messages::-webkit-scrollbar-thumb {
    background: var(--md-default-fg-color--lightest);
    border-radius: 3px;
}

.discord-messages::-webkit-scrollbar-thumb:hover {
    background: var(--md-default-fg-color--light);
}
</style>

## Core Principles

### 1. Radical Freedom  
- PvP, building, and raiding allowed EVERYWHERE  
- No safe zones or protected territories exist by default  

### 2. Ideological Tolerance  
- Extreme political/ideological views are permitted in global chat  
- **Hard boundary**: No targeting individuals with slurs, threats, or sustained harassment  

### 3. Death & Consequences  
- Inventory drops fully on death (standard behavior)  
- Griefing/theft is legal unless explicitly prevented

## VentureChat Commands

### Core Chat Commands

| Command | Description |
|---------|-------------|
| `/vmessage <player> <message>` | Private message another player |
| `/vreply <message>` | Reply to last private message |
| `/vignore <player>` | Ignore messages from a player |

### Channel Management

| Command | Description |
|---------|-------------|
| `/vchannel <channel>` | Join a chat channel |
| `/vchlist` | List available channels |
| `/vchwho <channel>` | See who's in a channel |

### Party System (Basic)

| Command | Description |
|---------|-------------|
| `/vparty host` | Host a new party or un-host |
| `/vparty chat` | Toggle chat autosend |
| `/vparty leave` | Leave current party |
| `/vparty kick` | Kick party member |

## Exceptional Permissions (Rare & Personalized)

!!! note
    Granted **only** by owners for **genuine accessibility needs**, not gameplay advantage.

- **Non-faction protections**  
  - Prevents block destruction *in a limited area* (not PvP immunity)  
- **Keep-Inventory**  
  - Applies *only* to death (XP still drops)  
- **Separation Safeguards**  
  - Forced chat/world isolation during irreconcilable conflicts  
- **Limits**  
  - Players granted any of these privileges may not use them to their advantage for griefing  

!!! warning "Owner discretion only"
    No public applications. Discuss privately via DM.

## Conflict Resolution

- **Primary Method**: Chat/world isolation  
- **Third-Party Harassment**  
  - Evidence of off-server attacks (DMs, forums, etc.) = permanent cross-platform ban  