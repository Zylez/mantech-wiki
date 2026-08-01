---
title: Install
description: How to install the Very Cool Cobblemon custom modpack for every popular Minecraft launcher.
---

# Installing the Modpack

The server runs on a **custom modpack** we've put together specifically for Very Cool Cobblemon. It's not on CurseForge or Modrinth — you download it directly as a zip and import it into your launcher.

- **Modloader:** Fabric
- **Minecraft version:** **1.21.1** — matching Cobblemon's supported version. We plan to stay here for a while.
- **Distribution:** direct download (see below).

---

## Step 1 — Download the Modpack Zip

Two versions are available. Pick whichever fits your launcher and situation.

<div class="grid cards" markdown>

-   :fontawesome-solid-box: __Standard__ (recommended)

    ---

    Smaller download. The zip contains a `modlist.html`; your launcher fetches each mod from CurseForge during import.

    - Smaller file (a few MB)
    - Mod files pulled fresh from CurseForge — signed, verified
    - Best for **CurseForge Launcher, ATLauncher, Prism, GDLauncher**

    [:octicons-download-16: **Download Standard**](https://e.pcloud.link/publink/show?code=XZmp7y7ZgGho1os8pIJW1qQ2cC4HCS6yQH3X){ .md-button .md-button--primary }

-   :fontawesome-solid-box-open: __Preloaded__

    ---

    Larger download. All mod files bundled directly in the zip — nothing to fetch at install time.

    - Larger file (a few hundred MB)
    - No CurseForge integration required
    - Best for **cracked launchers** (SKLauncher, TLauncher) or any launcher that stalls during CurseForge fetches

    [:octicons-download-16: **Download Preloaded**](https://e.pcloud.link/publink/show?code=XZYp7y7Zx26xSgSmaTYDKXIe87wUzkHJlG87){ .md-button }

</div>

!!! tip "Verifying the download"
    The Standard zip should be a few MB. The Preloaded zip should be several hundred MB. If either is much smaller than expected (< 100 KB), pCloud probably served the folder-listing page instead of the file — click through to the actual file and try again.

Save the zip somewhere easy to find (Downloads folder is fine). You'll point your launcher at it in Step 2.

---

## Step 2 — Import Into Your Launcher

Pick the tab for your launcher. Every path leads to the same end result — a Fabric profile with all our mods and configs loaded.

=== "CurseForge Launcher"

    Works best with the **Standard** download.

    1. Open the CurseForge app.
    2. Go to **Minecraft** in the sidebar.
    3. Click **Create Custom Profile → Import**.
    4. Select the zip you downloaded.
    5. Wait for it to unpack and finish setup (this is when the launcher fetches the mods).
    6. Click **Play** on the new profile.
    7. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

    !!! note "Offline / cracked accounts"
        The CurseForge launcher only allows logging in with a paid Microsoft account. If you don't have one, use ATLauncher or Prism instead — both accept the same zip.

=== "ATLauncher"

    Works with either download version. Try **Standard** first; if the CurseForge integration stalls, use **Preloaded**.

    1. Open ATLauncher.
    2. Go to the **Packs** tab → **Add Pack** (or the **+** icon).
    3. Choose **Import from Zip** (or drag the zip onto the ATLauncher window).
    4. Point it at the downloaded zip.
    5. Wait for the install to complete.
    6. Click **Play** on the new instance.
    7. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

    !!! tip "Offline mode works"
        ATLauncher supports offline / cracked accounts — set one up under **Accounts** if you don't have a paid Microsoft account.

=== "Prism Launcher / MultiMC"

    Works best with the **Standard** download.

    1. Open Prism (or MultiMC).
    2. Click **Add Instance**.
    3. Pick **Import from zip** on the left.
    4. Browse to the downloaded zip and open it.
    5. Give the instance a name and hit **OK**.
    6. Wait for the import to finish. Prism will fetch the Fabric loader and any dependencies automatically.
    7. Click **Launch**.
    8. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

=== "GDLauncher"

    Works best with the **Standard** download.

    1. Open GDLauncher.
    2. Click the **+** button (Add Instance).
    3. Choose **Import from zip**.
    4. Select the downloaded zip.
    5. Wait for the install.
    6. Click **Play**.
    7. In Minecraft: **Multiplayer → Add Server**, then enter the server IP from the [home page](../index.md).

=== "SKLauncher / TLauncher (manual)"

    Use the **Preloaded** download — it already contains the mod files, so no CurseForge integration is needed.

    Neither SKLauncher nor TLauncher can import modpack zips directly. You'll install Fabric first, then extract the pack contents into your profile.

    **A. Install Fabric through the launcher**

    1. In the launcher's version dropdown, pick **Fabric** for **Minecraft 1.21.1** (`fabric-loader-1.21.1`).
    2. If Fabric isn't listed, install it via the launcher's built-in Fabric installer (SKLauncher: **Settings/Tools**; TLauncher: enable the **Fabric** filter in versions).
    3. Launch that profile once so the `.minecraft` folder is created.

    **B. Extract the pack into your profile**

    1. Extract the Preloaded zip to a temporary folder. You should see subfolders like `mods/`, `config/`, `resourcepacks/`, and possibly `shaderpacks/`.
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

Populated live from the modpack's exported `modlist.html`. Click any mod to open its CurseForge page.

<div class="mod-list" data-source="../assets/modlist.html"></div>

## Included Resource Packs

The pack also ships with these resource packs, which load automatically the first time you launch the profile.

<!--
  MAINTENANCE NOTE:
  Add rows below as new resource packs are bundled with the pack.
  Format:
    | Pack Name | [Source](https://link.to/pack) |
-->

| Resource Pack | Source |
| --- | --- |
| *— replace with real entries —* | *[Modrinth](https://modrinth.com/) or [CurseForge](https://www.curseforge.com/)* |

---

## Troubleshooting

??? question "\"Outdated server\" or \"Outdated client\" in the multiplayer list"
    Your Fabric profile is running a different Minecraft version than the server. The server runs **1.21.1** — reinstall Fabric for exactly that version.

??? question "Game crashes on launch"
    Usually one of:

    - Your mods folder mixes our pack with mods from another profile — use a separate instance.
    - You extracted the pack into the wrong `.minecraft` folder (some launchers use a custom directory — check the launcher's **Settings**).
    - Your Fabric loader version doesn't match. Reinstall Fabric for exactly **1.21.1**.

??? question "\"Server modded, this client is vanilla\""
    Fabric loaded but the mods didn't. Double-check that the `mods/` folder ended up in the profile folder your launcher actually uses.

??? question "Launcher hangs during the CurseForge download step"
    Common with SKLauncher / TLauncher and occasionally CurseForge itself under heavy API load. Grab the **Preloaded** version instead — it skips the CurseForge fetch entirely.

??? question "Only a small file downloaded from pCloud"
    You landed on the folder page, not the file itself. Click through to the actual zip first, then hit Download.

??? question "Resource packs don't appear enabled"
    Open **Options → Resource Packs** and enable them manually. If they're not in the list at all, the `resourcepacks/` folder from the zip didn't get copied into your profile — repeat Step 2 for your launcher.

??? question "The mod list on this page is empty or shows an error"
    The site's `assets/modlist.html` file is missing or unreachable. If you're a player, refresh the page after a few minutes. If you're the admin, ensure `docs/assets/modlist.html` was committed and deployed.

## Still stuck?

Head to the [Support](../support/index.md) page to reach an admin.
