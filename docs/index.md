# Server Fundamentals

## Basic Information

- **Type**: Vanilla → PaperMC server with plugins  
- **IP**: `man.serveminecraft.net`  
- **Version**: 1.21.7 (24/7)  
- **Online-Mode**: OFF → Cracked clients supported  
- **World Type**: Unrestricted wilderness (build/mine/PvP everywhere)  

## Server Status

<div id="serverstatus">
    <p><b>Checking server status...</b></p>
</div>

## Core Principles

### 1. Radical Freedom  
- PvP, building, and raiding allowed EVERYWHERE  
- No safe zones or protected territories exist by default  

### 2. Land Control  
- Claims only provide temporary build protection  
- **No permanent safety**: All territory is raid-eligible  

### 3. Ideological Tolerance  
- Extreme political/ideological views are permitted in global chat  
- **Hard boundary**: No targeting individuals with slurs, threats, or sustained harassment  

### 4. Death & Consequences  
- Inventory drops fully on death (standard behavior)  
- Griefing/theft is legal unless explicitly prevented  

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

## Faction Land Warfare System

Powered by SaberFactions (v1.8) - available to ALL players  

!!! success "Radical wilderness twist"
    Claims aren't safe zones - they're battle flags!

### Core Mechanics

- **Claiming Land**: Stake territory for your faction  
- **Raiding**: Destroy/overclaim enemy territory  
- **Hardcore Rules**:  
  - No claim immunity during raids  
  - No build protection in war zones  

### Essential Commands

| Action | Command | Notes |
|--------|---------|-------|
| **Create Faction** | `/f create <name>` | Costs 500 XP |
| **Claim Chunk** | `/f claim` | 16x16 area at your location |
| **Declare Raid** | `/f declarewar <faction>` | 10-minute raid prep |
| **Overclaim Land** | `/f overclaim` | Destroy weakened enemy claim |
| **Check Strength** | `/f map` | Shows nearby claims & vulnerability |

### Raiding Protocol

1. **Declare war** → Triggers 10-min PvP immunity period  
2. **Damage claims** → Break blocks in enemy territory to reduce "faction power"  
3. **Overclaim** → Use `/f overclaim` when power drops below 10%  
4. **Consequences** →  
   - Successful raid: Claim ownership transfers  
   - Failed raid: Attacking faction loses 30% power  

## Technical Environment

Plugins:  
  - SaberFactions v1.8 (core land warfare)  
  - MythicMobs (custom mobs)  
  - ModelEngine (animated models)  
Hardcore Features:  
  - Raiding enabled  
  - Claim vulnerability: 100%  
  - New claim cooldown: 2 hours    