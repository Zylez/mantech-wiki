---
title: Install
description: How to install the Cobblemon server's modpack — with AutoModpack, as a static pack, or fully manually.
---

# Installing the Modpack

Everything you need to get on the server. Pick whichever setup approach suits you — all four end with you on the server, and the server ships with **AutoModpack** so any of them stays in sync automatically once you connect.

!!! tip "Which method should I pick?"

    - **New to modded Minecraft, or you just want to play?** → Method 1 (pre-built AutoModpack pack).
    - **Already have a Fabric instance you like?** → Method 2 (add AutoModpack to it).
    - **Prefer a static, self-contained install?** → Method 3 (standard modpack).
    - **Want total control over every file?** → Method 4 (manual).

## How to Join

=== "1. Pre-built AutoModpack modpack (easiest)"

    This is a clean Fabric instance with **AutoModpack pre-installed** and the required client-side resource packs already in place. Once launched, connecting to the server pulls in everything else automatically. Nothing to configure.

    **Download:**  
    :fontawesome-solid-download: [Cobblemon Server – AutoModpack Base (.zip)](#){ .modpack-link title="Replace with your actual link" }

    **Steps (any CurseForge-aware launcher):**

    1. In your launcher, choose **Import modpack** (or **Add instance → From .zip**).
    2. Select the downloaded `.zip`.
    3. Wait for the launcher to build the instance.
    4. Launch the instance.
    5. **Multiplayer → Add Server**, enter the server IP from the [home page](../index.md).
    6. On first connect, AutoModpack asks you to verify the server's certificate fingerprint. Confirm it.
    7. AutoModpack downloads the current modpack. When it's done, restart Minecraft. Done.

    **For SKLauncher / TLauncher (no CurseForge-format import):**  
    Extract the `.zip` manually and copy the `mods/`, `config/`, and `resourcepacks/` folders into your Fabric profile's `.minecraft` folder. Then launch that Fabric profile. If you'd rather skip the pre-built pack entirely, the **Fully manual** tab has step-by-step instructions.

=== "2. Add AutoModpack to your own instance"

    If you already have a working Fabric instance (any version, any launcher), you don't need any of our downloads. Just install AutoModpack and connect.

    **Steps:**

    1. Install **Fabric Loader** for the Minecraft version the server is running (check the [status box on the home page](../index.md#live-server-status)).
    2. Install **Fabric API** for the same version. Grab it from [Modrinth](https://modrinth.com/mod/fabric-api) or [CurseForge](https://www.curseforge.com/minecraft/mc-mods/fabric-api) and place the `.jar` in your instance's `mods/` folder.
    3. Download **AutoModpack** from [Modrinth](https://modrinth.com/mod/automodpack) or [CurseForge](https://www.curseforge.com/minecraft/mc-mods/automodpack). Match the Minecraft version.
    4. Drop the AutoModpack `.jar` into the same `mods/` folder.
    5. Launch the instance.
    6. **Multiplayer → Add Server**, enter the server IP from the [home page](../index.md).
    7. On first connect: verify the server's fingerprint → confirm the modpack install → wait for the download → restart Minecraft.

    !!! success "Your own mods stay untouched"
        AutoModpack downloads the server's synced files into `~/.minecraft/automodpack/modpacks/…`, isolated from your instance's regular `mods/` folder. Any client-side-only mods you've added — minimaps, shader loaders, cosmetic mods — keep working alongside the synced modpack.

    !!! tip "Even quicker: AutoModpack's own Fabric installer"
        AutoModpack ships a modified [Fabric installer](https://modrinth.com/mod/automodpack) that installs Fabric loader and AutoModpack in one step. If you're setting up a fresh instance from scratch, that saves you steps 1–4 above.

=== "3. Standard modpack (no AutoModpack)"

    A regular CurseForge-format modpack containing a `modlist.html` — your launcher fetches every mod from Modrinth and CurseForge at import time and locks the versions in. Once installed, you connect like it's a vanilla server. No live sync; when the server updates its mods, you'll need to reimport a new version of this pack.

    **Download:**  
    :fontawesome-solid-download: [Cobblemon Server – Standard Modpack (.zip)](#){ .modpack-link title="Replace with your actual link" }

    **Steps (CurseForge, ATLauncher, Prism, GDLauncher, or MultiMC):**

    1. In your launcher, choose **Import modpack** (or **Add instance → From .zip**).
    2. Select the downloaded `.zip`.
    3. The launcher reads the `modlist.html`/`manifest.json` and downloads every mod from its source. This usually takes a few minutes.
    4. Launch the instance.
    5. **Multiplayer → Add Server**, enter the server IP from the [home page](../index.md).

    !!! warning "SKLauncher / TLauncher don't import CurseForge modpacks natively"
        For those launchers, use one of the CurseForge-aware launchers above just for the import step, then point your usual launcher at the resulting instance folder. Or switch to the **Fully manual** tab above.

=== "4. Fully manual"

    Install every mod and resource pack by hand. Most control, most work. The lists further down this page are the source of truth — copy every mod's `.jar` into your instance's `mods/` folder and every resource pack's `.zip` into `resourcepacks/`.

    **Steps:**

    1. In your launcher, install **Fabric Loader** for the Minecraft version the server is running (check the [status box](../index.md#live-server-status)).
    2. Install **Fabric API** — put its `.jar` into your instance's `mods/` folder.
    3. From the [Required mods](#required-mods) section below, download each mod's `.jar` (match the correct Minecraft version). Drop them all into `mods/`.
    4. From the [Required resource packs](#required-resource-packs) section below, download each `.zip` and drop them into `resourcepacks/`.
    5. Launch the instance. In Minecraft's **Options → Resource Packs**, enable each pack.
    6. **Multiplayer → Add Server**, enter the server IP from the [home page](../index.md).

    Your Minecraft instance folder is usually at:

    ```text
    C:\Users\%USERNAME%\AppData\Roaming\.minecraft
    ```

    On some launchers (Prism, MultiMC) the profile has its own `minecraft/` folder inside the instance directory. Check your launcher's docs if you're unsure.

## Required Mods

The list below is fetched live from the server. Whenever the server's mod folder changes, this list catches up on the next request (the API caches for 5 minutes to avoid hammering the server). Each entry links to the mod's official page — CurseForge, Modrinth, GitHub, or wherever the mod author publishes it.

<div id="mod-list"
     class="modlist"
     data-modlist-src="https://man.servegame.com/api/modlist"
     aria-live="polite">
    <p class="modlist-loading">Loading mod list…</p>
</div>

!!! note "Version matching"
    The mod list doesn't include per-mod version numbers because those move fast. Always pick the `.jar` for the same Minecraft version the server is currently running — check the [status box on the home page](../index.md#live-server-status).

## Required Resource Packs

Resource packs are needed to correctly display the custom content the server uses. Enable each in **Options → Resource Packs** after adding.

<!--
    Maintain this table manually — resource packs don't come with a
    modlist-style file, so this is the source of truth for both the
    site and any player doing a manual install.

    Format:
      | Pack | Source | Download |
-->

| Pack | Source | Download |
|---|---|---|
| Complete Cobblemon Collection | Modrinth | [Link](https://modrinth.com/datapack/complete-cobblemon-collection-myths-and-legends-compat) |
| COBBLEVERSE RCTmod RP | Modpack | [Link](https://modrinth.com/modpack/cobbleverse) |

## Verifying it Worked

Once the game loads:

- [x] Bottom-left of the main menu shows `Fabric API` (and, if you used AutoModpack, an AutoModpack notice).
- [x] The main menu has a **Mods** button showing the mod list.
- [x] Server IP appears as compatible in your multiplayer list.
- [x] If you connected via AutoModpack, the first connection prompts a fingerprint check and a modpack confirmation before downloading.

If any of these are missing, jump to [Troubleshooting](#troubleshooting) below.

## Troubleshooting

??? question "\"Outdated server\" or \"Outdated client\" in the multiplayer list"
    Your Fabric profile is running a different Minecraft version than the server. Check the version in the [home page status box](../index.md#live-server-status) and reinstall Fabric for that exact version.

??? question "Game crashes on launch"
    Usually a mismatch between the pack version and the Minecraft version. Reinstall the pack (or reinstall Fabric + redownload mods) for the version the server is currently running.

??? question "\"Server modded, this client is vanilla\""
    Fabric loaded, but no mods did. Double-check that your `mods/` folder ended up in the actual profile folder your launcher uses. In SKLauncher/TLauncher, this is usually `.minecraft`; in Prism/MultiMC it's inside the instance's `minecraft/` subfolder.

??? question "AutoModpack asks about a certificate fingerprint — is that safe?"
    Yes. AutoModpack encrypts its downloads and asks you to verify the server on first connect so nobody can substitute their own modpack. Just confirm and it'll remember for future connects.

??? question "AutoModpack downloaded the pack but the game is still \"vanilla\""
    You need to **restart Minecraft** after the download finishes. AutoModpack loads the downloaded modpack on next launch — not mid-session.

??? question "The modpack I imported has no mods after install"
    Some CurseForge packs only ship a `manifest.json` for licensing reasons. Use a CurseForge-aware launcher (CurseForge, ATLauncher, Prism, GDLauncher) — those fetch the actual mod files automatically. SKLauncher and TLauncher can't do this on their own.

??? question "The mod list on this page didn't load"
    The list is fetched from the server's `/api/modlist` endpoint. If the API is unreachable — server offline, network hiccup — the list won't render. Use one of the AutoModpack methods above in the meantime; they don't rely on this list.

## Still stuck?

Head to the [Support](../support/index.md) page to reach an admin.
