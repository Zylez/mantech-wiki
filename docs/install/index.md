---
title: Install
description: How to install the Cobblemon Official Modpack for every popular Minecraft launcher.
---

# Installing the Modpack

To connect to the Very Cool Cobblemon Server you'll need the **Cobblemon Official Modpack \[Fabric\]** by CobbledStudios installed on your client.

- **Modpack page (CurseForge):** [https://www.curseforge.com/minecraft/modpacks/cobblemon-fabric](https://www.curseforge.com/minecraft/modpacks/cobblemon-fabric)
- **Modloader:** Fabric
- **Minecraft version:** Whatever the current pack version supports (typically **1.21.1** or **1.20.1**)

!!! tip "Which version should I install?"
    Match the **server's current version**, shown in the [live status box on the home page](../index.md#live-server-status). If the server is on 1.21.1, install the 1.21.1 build of the pack.

Pick the tab for your launcher:

=== "CurseForge Launcher"

    The easiest path. CurseForge handles Fabric installation, mod downloads, and dependencies for you.

    **Steps**

    1. Download and install the [CurseForge app](https://www.curseforge.com/download/app).
    2. Open the app and pick **Minecraft** as the game.
    3. Click **Browse Modpacks**.
    4. Search for `Cobblemon Official Modpack [Fabric]`.
    5. Hit the **Install** button on the pack page.
    6. Wait for the install to finish (it will download the correct Fabric loader, Minecraft version, and mods).
    7. Click **Play** on the installed instance.
    8. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

    !!! note "Offline mode / cracked accounts"
        The CurseForge launcher only allows logging in with a **premium (paid) Microsoft account**. If you don't have one, use one of the other launcher tabs.

=== "ATLauncher"

    ATLauncher is free, supports CurseForge modpacks, and — importantly for many players here — supports **offline / cracked** accounts too.

    **Steps**

    1. Download and install [ATLauncher](https://atlauncher.com/downloads).
    2. Open ATLauncher. If you have a paid account, add it under **Accounts**. Otherwise, use the **Offline** account option.
    3. Go to the **Packs** tab.
    4. Enable the **CurseForge** filter and search for `Cobblemon Official Modpack [Fabric]`.
    5. Click **New Instance**.
    6. Wait for the install to finish.
    7. Click **Play** on the instance.
    8. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

=== "SKLauncher"

    SKLauncher doesn't install CurseForge modpacks natively, so you'll install Fabric first, then drop the modpack's mods folder into your profile.

    **A. Install Fabric through SKLauncher**

    1. Open SKLauncher and go to the **Installations** (or **Profiles**) tab.
    2. Create a new installation. In the version dropdown, pick **Fabric** for the Minecraft version the server is running (e.g. `fabric-loader-1.21.1`).
    3. If Fabric isn't listed, click **Install Fabric** (SKLauncher has a built-in Fabric installer under **Settings** or **Tools** depending on version), then reload the version list.
    4. Launch that profile once so the game generates a `.minecraft` folder (or your custom profile folder).

    **B. Add the modpack mods**

    1. On your PC, open the [modpack page](https://www.curseforge.com/minecraft/modpacks/cobblemon-fabric) and download the **client zip** for the matching version.
    2. Extract the zip somewhere temporary. Inside you'll find a `mods/` folder (and usually `config/`, `resourcepacks/`, etc.).
    3. Open your Minecraft profile folder:

        ```text
        C:\Users\%USERNAME%\AppData\Roaming\.minecraft
        ```

    4. **Copy** the `mods/` folder from the pack into your Minecraft profile folder. Do the same for `config/` and `resourcepacks/` if they're included.
    5. Launch the Fabric profile in SKLauncher.
    6. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

    !!! warning "Some CurseForge modpacks ship without the actual mod .jar files"
        If your extracted `mods/` folder only contains a `manifest.json` or a very small number of files, the pack expects a CurseForge-aware launcher to fetch the mods. In that case use **ATLauncher** or the **Manual** tab instead.

=== "TLauncher"

    Same approach as SKLauncher — install Fabric first, then add the modpack contents.

    **A. Install Fabric through TLauncher**

    1. Open TLauncher.
    2. Click the version dropdown (below the username field).
    3. Enable the **Show all versions** and **Fabric** filters if hidden.
    4. Pick `Fabric x.x.x - Fabric x.x.x` matching the Minecraft version the server is running.
    5. Click **Install** or **Launch** once so TLauncher installs the Fabric loader and generates the profile folder.

    **B. Add the modpack mods**

    Same steps as **SKLauncher → B**. Copy the extracted `mods/` (and `config/`, `resourcepacks/`) into:

    ```text
    C:\Users\%USERNAME%\AppData\Roaming\.minecraft
    ```

    Then relaunch that Fabric profile.

    !!! warning "TLauncher variants"
        Some builds of TLauncher use a custom profile folder — check **Settings → Directory** to confirm where your `.minecraft` actually lives.

=== "Any other launcher (Prism, GDLauncher, MultiMC, etc.)"

    Prism Launcher and GDLauncher have first-class CurseForge modpack support and work offline.

    **Prism Launcher / MultiMC**

    1. In the launcher, click **Add Instance → CurseForge**.
    2. Search for `Cobblemon Official Modpack [Fabric]`.
    3. Click **OK** — Prism downloads the correct Fabric loader, Minecraft version, and all mods.
    4. Launch and connect to the server IP.

    **GDLauncher**

    1. Create a new instance and pick **Fabric** as the loader.
    2. Open the instance's **Addons** tab.
    3. Paste the Quick Install ID `#cobblemon-fabric` and click **Download**.
    4. Launch and connect.

## Verifying it Worked

Once the game loads:

- [x] The bottom-left corner should show `Fabric API` or `Cobblemon` in the mods list.
- [x] The main menu should have a **Mods** button.
- [x] Adding the server IP should show it as compatible in the multiplayer server list.

If any of these are missing, jump to [Troubleshooting](#troubleshooting) below.

## Troubleshooting

??? question "\"Outdated server\" or \"Outdated client\" in the multiplayer list"
    Your Fabric profile is running a different Minecraft version than the server. Check the version in the [home page status box](../index.md#live-server-status) and reinstall Fabric for that exact version.

??? question "Game crashes on launch"
    Usually a mismatch between the pack version and the Minecraft version. Redownload the pack for the version the server is currently running and replace your `mods/` folder.

??? question "\"Server modded, this client is vanilla\""
    Fabric loaded, but the mods didn't. Double-check that the `mods/` folder ended up in the actual profile folder your launcher uses. In SKLauncher/TLauncher, this is usually `.minecraft`; in Prism/MultiMC it's inside the instance's `minecraft/` subfolder.

??? question "No mods found in the client zip"
    Some CurseForge packs only ship a `manifest.json` for licensing reasons. Use a CurseForge-aware launcher (CurseForge, ATLauncher, Prism, GDLauncher) instead — those fetch the actual mod files automatically.

## Still stuck?

Head to the [Support](../support/index.md) page to reach an admin.
