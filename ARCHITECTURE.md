# Precious Materials Rework — Architecture

## System Overview

```
User selects Material + Grade in PF2E Item Sheet
        ↓
Hooks.on('preUpdateItem')   ← main.js
        ↓
1. Remove old PMR rules from item's system.rules[]
2. Look up effects: MATERIAL_EFFECTS[slug][grade][category]
3. Build Rule Elements via rule-builder.js
4. Inject tagged rules into system.rules[]
        ↓
Hooks.on('updateItem')      ← main.js
        ↓
5. Remove old PMR Action Items from actor
6. Create new Action Items as embedded items on actor
        ↓
Hooks.on('deleteItem')      ← main.js
        ↓
7. Clean up Action Items from actor when source item deleted
```

## File Structure

```
precious-materials-rework/
├── module.json              # Module manifest
├── ARCHITECTURE.md          # This file
├── scripts/
│   ├── main.js              # Hook registration and orchestration
│   ├── material-effects.js  # Lookup table: material × grade × itemType → rules + actions
│   ├── rule-builder.js      # Builds PF2E Rule Element objects from templates
│   └── action-manager.js    # Creates/removes Action Items on actors
├── lang/
│   ├── en.json              # English translations
│   └── de.json              # German translations
└── styles/
    └── precious-materials.css  # Minimal styling
```

## Key Design Decisions

### Why Not GrantItem?
PF2E's `GrantItem` Rule Element has a hard restriction: `"parent item must not be physical"`. Since weapons, armor, and shields are physical items, GrantItem cannot be used to grant action items from them. Instead, we manage action items as separate embedded items on the actor via `ActionManager`.

### Rule Element Tagging
Every Rule Element injected by this module carries a flag:
```javascript
rule['flags.precious-materials-rework'] = true
```
This allows clean identification and removal when materials change.

### Action Item Linking
Every action item created on an actor carries flags:
```javascript
flags: {
  'precious-materials-rework': {
    materialAction: true,
    sourceItemId: 'abc123',  // ID of the weapon/armor/shield
    actionId: 'destructive-counter',
    materialSlug: 'adamantine',
    grade: 'high',
    category: 'shield'
  }
}
```

## Dependencies

| Change | Also Update |
|--------|-------------|
| New material added | `material-effects.js` (effects table), `lang/*.json` (translations) |
| New action added | `action-manager.js` (ACTION_DEFINITIONS), `material-effects.js` (action reference) |
| Material slug changed | `material-effects.js` (MATERIAL_SLUGS + effects key) |
| Rule Element format changed | `rule-builder.js` |

## Material → PF2E Slug Mapping

| Homebrew Name | PF2E System Slug | Notes |
|---------------|-----------------|-------|
| Adamantine | `adamantine` | Exists in PF2E |
| Cold Iron | `cold-iron` | Exists in PF2E |
| Darkwood | `duskwood` | Remaster name |
| Djezet | `djezet` | Exists in PF2E |
| Dragoncraft | `dragonhide` | Exists in PF2E |
| Mithral | `dawnsilver` | Remaster name |
| Orichalcum | `orichalcum` | Exists in PF2E |
| Silver | `silver` | Exists in PF2E |
| Sovereign Steel | `sovereign-steel` | Exists in PF2E |
| Throneglass | `throneglass` | **Custom — needs registration** |
| Singing Steel | `singing-steel` | **Custom — needs registration** |

## Verification Commands

```javascript
// Check PMR rules on an item
item.system.rules.filter(r => r['flags.precious-materials-rework'])

// Check PMR actions on an actor
actor.items.filter(i => i.flags?.['precious-materials-rework']?.materialAction)

// Remove all PMR actions from an actor (debug)
game.modules.get('precious-materials-rework')
```

## Item Category Detection

```
item.type === 'weapon'  → category: 'weapon'
item.type === 'armor'   → check item.system.category:
  - 'shield' → category: 'shield'
  - else     → category: 'armor'
item.type === 'shield'  → category: 'shield'
```
