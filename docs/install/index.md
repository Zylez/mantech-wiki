---
title: Install
description: How to install the Very Cool Cobblemon custom modpack for every popular Minecraft launcher.
---

# Installing the Modpack

The server runs on a **custom modpack** we've put together specifically for Very Cool Cobblemon. It's not on CurseForge or Modrinth — you download it directly as a zip and import it into your launcher.

- **Modloader:** Fabric
- **Minecraft version:** Check the [live status box on the home page](../index.md#live-server-status) — it always shows what the server is currently running.
- **Distribution:** direct download (see below).

---

## Step 1 — Download the Modpack Zip

<div class="grid cards" markdown>

-   :fontawesome-solid-download: __Download the pack__

    ---

    [:octicons-download-16: **Download from pCloud**](https://e.pcloud.link/publink/show?code=XZtSyy7ZLaaJV2GQvrV5KV2DV3fK6z3wDqmX){ .md-button .md-button--primary }

    File: `Very Cool Cobblemon Modpack 1.0 1.21.1.zip`  
    Hosted on pCloud, no account required.

</div>

!!! tip "Verify the download"
    The zip should be a few hundred MB. If it's tiny (<1 MB), pCloud served the folder-listing page instead of the file — click through to the actual file first, then download.

Save the zip somewhere easy to find (Downloads folder is fine). You'll point your launcher at it in Step 2.

---

## Step 2 — Import Into Your Launcher

Pick the tab for your launcher. Every path leads to the same end result — a Fabric profile with all our mods and configs loaded.

=== "CurseForge Launcher"

    1. Open the CurseForge app.
    2. Go to **Minecraft** in the sidebar.
    3. Click **Create Custom Profile → Import**.
    4. Select the `VeryCoolCobblemon.zip` you downloaded.
    5. Wait for it to unpack and finish setup.
    6. Click **Play** on the new profile.
    7. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

    !!! note "Offline / cracked accounts"
        The CurseForge launcher only allows logging in with a paid Microsoft account. If you don't have one, use ATLauncher or Prism instead — both accept the same zip.

=== "ATLauncher"

    1. Open ATLauncher.
    2. Go to the **Packs** tab → **Add Pack** (or the **+** icon).
    3. Choose **Import from Zip** (or drag the zip onto the ATLauncher window).
    4. Point it at `VeryCoolCobblemon.zip`.
    5. Wait for the install to complete.
    6. Click **Play** on the new instance.
    7. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

    !!! tip "Offline mode works"
        ATLauncher supports offline / cracked accounts — set one up under **Accounts** if you don't have a paid Microsoft account.

=== "Prism Launcher / MultiMC"

    1. Open Prism (or MultiMC).
    2. Click **Add Instance**.
    3. Pick **Import from zip** on the left.
    4. Browse to `VeryCoolCobblemon.zip` and open it.
    5. Give the instance a name and hit **OK**.
    6. Wait for the import to finish. Prism will fetch the Fabric loader and any dependencies automatically.
    7. Click **Launch**.
    8. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

=== "GDLauncher"

    1. Open GDLauncher.
    2. Click the **+** button (Add Instance).
    3. Choose **Import from zip**.
    4. Select `VeryCoolCobblemon.zip`.
    5. Wait for the install.
    6. Click **Play**.
    7. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

=== "SKLauncher / TLauncher (manual)"

    Neither SKLauncher nor TLauncher can import modpack zips directly. You'll install Fabric first, then extract the pack contents into your profile.

    **A. Install Fabric through the launcher**

    1. In the launcher's version dropdown, pick **Fabric** for the Minecraft version the server is running (e.g. `fabric-loader-1.21.1`).
    2. If Fabric isn't listed, install it via the launcher's built-in Fabric installer (SKLauncher: **Settings/Tools**; TLauncher: enable the **Fabric** filter in versions).
    3. Launch that profile once so the `.minecraft` folder is created.

    **B. Extract the pack into your profile**

    1. Extract `VeryCoolCobblemon.zip` to a temporary folder. You should see subfolders like `mods/`, `config/`, `resourcepacks/`, and possibly `shaderpacks/`.
    2. Open your Minecraft profile folder:

        ```text
        C:\Users\%USERNAME%\AppData\Roaming\.minecraft
        ```

    3. **Copy** the following from the extracted pack into `.minecraft` (**merge**, don't replace whole folders if you have other Fabric setups):
        - `mods/`
        - `config/`
        - `resourcepacks/`
        - `shaderpacks/` (if present)
    4. Launch the Fabric profile in SKLauncher / TLauncher.
    5. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

    !!! warning "Existing mods folder"
        If you already have a `mods/` folder from another Fabric profile, back it up first — mixing mod sets usually crashes the game. The safe move is to use a *separate* launcher instance or a *separate* game directory for this pack.

---

## Step 3 — Verifying It Worked

Once the game loads:

- [x] The main menu shows a **Mods** button.
- [x] Clicking **Mods** lists Cobblemon and Fabric API among many others.
- [x] Adding the server IP shows it as compatible in the multiplayer server list.
- [x] Optional: the resource packs bundled with the pack appear at the top of your resource-pack list already enabled.

If any of these are missing, jump to [Troubleshooting](#troubleshooting).

---

## Included Mods

The pack ships with the following mods. Version bumps happen as we tune the server — check back after any [News](../news/index.md) post that mentions a mod update.

<!--
  MAINTENANCE NOTE:
  Add or update rows below as the pack changes. Format:
  | Mod Name | 1.2.3 | [Modrinth](https://modrinth.com/mod/slug) |
  | Mod Name | 1.2.3 | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/slug) |
  Sort however you like — alphabetical is easiest for players to scan.
-->

| Mod | Version | Source |
| --- | --- | --- |
| *— replace with real entries —* | *0.0.0* | *[Modrinth](https://modrinth.com/) or [CurseForge](https://www.curseforge.com/)* |

## Included Resource Packs

The pack also ships with these resource packs, which load automatically the first time you launch the profile.

<!--
  MAINTENANCE NOTE:
  Same format as the Mods table above.
-->

| Resource Pack | Version | Source |
| --- | --- | --- |
| *— replace with real entries —* | *0.0.0* | *[Modrinth](https://modrinth.com/) or [CurseForge](https://www.curseforge.com/)* |

---

## Troubleshooting

??? question "\"Outdated server\" or \"Outdated client\" in the multiplayer list"
    Your Fabric profile is running a different Minecraft version than the server. Check the version in the [home page status box](../index.md#live-server-status) and reinstall the pack for that exact version.

??? question "Game crashes on launch"
    Usually one of:
    
    - Your mods folder mixes our pack with mods from another profile — use a separate instance.
    - You extracted the pack into the wrong `.minecraft` folder (some launchers use a custom directory — check the launcher's **Settings**).
    - Your Fabric loader version doesn't match. Reinstall Fabric for the exact Minecraft version the server runs.

??? question "\"Server modded, this client is vanilla\""
    Fabric loaded but the mods didn't. Double-check that the `mods/` folder ended up in the profile folder your launcher actually uses.

??? question "Only a small file downloaded from pCloud"
    You landed on the folder page, not the file itself. Click through to the actual `VeryCoolCobblemon.zip` first, then hit Download.

??? question "Resource packs don't appear enabled"
    Open **Options → Resource Packs** and enable them manually. If they're not in the list at all, the `resourcepacks/` folder from the zip didn't get copied into your profile — repeat Step 2 for your launcher.

## Still stuck?

Head to the [Support](../support/index.md) page to reach an admin.
