/**
 * Precious Materials Rework — Foundry VTT Module
 *
 * Automatically applies homebrew material effects when a user sets
 * material + grade on a weapon, armor, or shield in the PF2E system.
 *
 * Architecture:
 *   preUpdateItem → inject/remove Rule Elements on the item
 *   updateItem    → create/remove Action Items on the actor
 *   deleteItem    → clean up Action Items from the actor
 */

import { MATERIAL_EFFECTS, MODULE_ID, MATERIAL_SLUGS, ITEM_CATEGORIES } from './material-effects.js';
import { buildRulesForMaterial } from './rule-builder.js';
import { ActionManager } from './action-manager.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const PMR_FLAG = `flags.${MODULE_ID}`;

// ─── Dragon Element Mapping ──────────────────────────────────────────────────

const DRAGON_ELEMENTS = ['fire', 'cold', 'electricity', 'acid', 'poison'];

// ─── Hooks ───────────────────────────────────────────────────────────────────

Hooks.once('init', () => {
  console.log(`${MODULE_ID} | Initializing Precious Materials Rework`);

  // Register custom materials that don't exist in PF2E
  registerCustomMaterials();
});

Hooks.once('ready', () => {
  console.log(`${MODULE_ID} | Ready — ${Object.keys(MATERIAL_EFFECTS).length} materials loaded`);
});

/**
 * preUpdateItem — fires BEFORE the item is updated in the database.
 * We intercept material changes AND dragonElement flag changes here.
 */
Hooks.on('preUpdateItem', (item, changes, options, userId) => {
  const category = getItemCategory(item);
  if (!category) return;

  // Case 1: Material type/grade is being changed
  const materialChange = changes?.system?.material;

  // Case 2: Dragon element flag is being changed (for Dragonhide items)
  const dragonElementChange = changes?.flags?.[MODULE_ID]?.dragonElement;

  if (!materialChange && !dragonElementChange) return;

  // Determine the effective material state after this update
  const newType = materialChange?.type ?? item.system.material?.type ?? '';
  const newGrade = materialChange?.grade ?? item.system.material?.grade ?? '';

  console.log(`${MODULE_ID} | Material change on "${item.name}": ${newType} (${newGrade})${dragonElementChange ? ` [element: ${dragonElementChange}]` : ''}`);

  // Get current rules, filtering out any existing PMR rules
  const currentRules = (item.system.rules ?? []).filter(r => !r[PMR_FLAG]);

  if (!newType || !newGrade) {
    // Material removed — strip all PMR rules
    console.log(`${MODULE_ID} | Material removed, clearing PMR rules`);
    changes.system = changes.system ?? {};
    changes.system.rules = currentRules;
    return;
  }

  // Look up effects for this material + grade + category
  const effects = MATERIAL_EFFECTS[newType]?.[newGrade]?.[category];
  if (!effects) {
    console.log(`${MODULE_ID} | No PMR effects found for ${newType}/${newGrade}/${category}`);
    changes.system = changes.system ?? {};
    changes.system.rules = currentRules;
    return;
  }

  // For Dragonhide: if element is being changed in this update, pass a temporary item
  // with the new element so rule-builder uses it
  let itemForRules = item;
  if (dragonElementChange && newType === 'dragonhide') {
    // Create a proxy that reports the new element
    itemForRules = {
      ...item,
      flags: {
        ...item.flags,
        [MODULE_ID]: {
          ...(item.flags?.[MODULE_ID] ?? {}),
          dragonElement: dragonElementChange,
        },
      },
    };
  }

  // Validate material compatibility
  validateMaterialCompatibility(newType, newGrade, category, item);

  // Build Rule Elements
  const pmrRules = buildRulesForMaterial(newType, newGrade, category, effects, itemForRules);

  // Merge with existing non-PMR rules
  changes.system = changes.system ?? {};
  changes.system.rules = [...currentRules, ...pmrRules];

  console.log(`${MODULE_ID} | Injected ${pmrRules.length} PMR rules on "${item.name}"`);
});

/**
 * updateItem — fires AFTER the item is updated.
 * We manage Action Items on the owning actor here.
 * Also triggers the Dragonhide element dialog if needed.
 */
Hooks.on('updateItem', async (item, changes, options, userId) => {
  // Only the triggering user should manage actions (avoid duplicates)
  if (game.user.id !== userId) return;

  const materialChange = changes?.system?.material;
  const dragonElementChange = changes?.flags?.[MODULE_ID]?.dragonElement;

  if (!materialChange && !dragonElementChange) return;

  const category = getItemCategory(item);
  if (!category) return;

  const materialSlug = item.system.material?.type ?? '';
  const grade = item.system.material?.grade ?? '';

  // ── Dragonhide Element Dialog ──
  // If dragonhide was just set and no element chosen yet, prompt the user
  if (materialChange?.type === 'dragonhide' && !item.flags?.[MODULE_ID]?.dragonElement) {
    showDragonElementDialog(item);
  }

  // ── Action Management ──
  const actor = item.actor;
  if (!actor) return; // Item not on an actor yet

  // Remove old PMR actions for this item
  await ActionManager.removeActionsForItem(actor, item.id);

  if (!materialSlug || !grade) return; // Material was removed, we're done

  // Check if this material/grade/category has actions
  const effects = MATERIAL_EFFECTS[materialSlug]?.[grade]?.[category];
  if (!effects?.actions?.length) return;

  // Create new action items on the actor
  await ActionManager.createActionsForItem(actor, item, materialSlug, grade, category, effects.actions);
});

/**
 * deleteItem — fires when an item is deleted.
 * Clean up any PMR action items from the actor.
 */
Hooks.on('deleteItem', async (item, options, userId) => {
  if (game.user.id !== userId) return;

  const actor = item.actor;
  if (!actor) return;

  const category = getItemCategory(item);
  if (!category) return;

  await ActionManager.removeActionsForItem(actor, item.id);
});

/**
 * createItem — fires when an item is added to an actor.
 * If the item already has a material set, create actions.
 */
Hooks.on('createItem', async (item, options, userId) => {
  if (game.user.id !== userId) return;

  const actor = item.actor;
  if (!actor) return;

  const category = getItemCategory(item);
  if (!category) return;

  const materialSlug = item.system.material?.type ?? '';
  const grade = item.system.material?.grade ?? '';

  if (!materialSlug || !grade) return;

  const effects = MATERIAL_EFFECTS[materialSlug]?.[grade]?.[category];
  if (!effects?.actions?.length) return;

  await ActionManager.createActionsForItem(actor, item, materialSlug, grade, category, effects.actions);
});

// ─── Custom Material Registration ────────────────────────────────────────────

/**
 * Register custom materials (Throneglass, Singing Steel) with the PF2E system.
 * These don't exist in the base system and need to be added so they appear
 * in the material dropdown on item sheets.
 */
function registerCustomMaterials() {
  // Hook into PF2E's material registration if available
  // PF2E exposes CONFIG.PF2E.preciousMaterials for the dropdown
  Hooks.once('ready', () => {
    const preciousMaterials = CONFIG.PF2E?.preciousMaterials;
    if (!preciousMaterials) {
      console.warn(`${MODULE_ID} | Could not find CONFIG.PF2E.preciousMaterials — custom materials not registered`);
      return;
    }

    // Register Throneglass
    if (!preciousMaterials.throneglass) {
      preciousMaterials.throneglass = 'Throneglass';
      console.log(`${MODULE_ID} | Registered custom material: Throneglass`);
    }

    // Register Singing Steel
    if (!preciousMaterials['singing-steel']) {
      preciousMaterials['singing-steel'] = 'Singing Steel';
      console.log(`${MODULE_ID} | Registered custom material: Singing Steel`);
    }
  });
}

// ─── Dragoncraft Element Dialog ──────────────────────────────────────────────

/**
 * Show a dialog for the user to pick the dragon element type.
 * Sets the chosen element as a flag on the item, which triggers
 * a preUpdateItem to rebuild rules with the correct element.
 *
 * @param {Item} item - The dragonhide item
 */
function showDragonElementDialog(item) {
  const elements = DRAGON_ELEMENTS.map(el => ({
    id: el,
    label: game.i18n.localize(`PMR.DragonElementDialog.${el.charAt(0).toUpperCase() + el.slice(1)}`) || el,
  }));

  const content = `
    <div class="pmr-dragon-element-dialog">
      <p>${game.i18n.localize('PMR.DragonElementDialog.Prompt')}</p>
      <select id="pmr-dragon-element">
        ${elements.map(e => `<option value="${e.id}">${e.label}</option>`).join('')}
      </select>
    </div>
  `;

  new Dialog({
    title: game.i18n.localize('PMR.DragonElementDialog.Title'),
    content,
    buttons: {
      confirm: {
        icon: '<i class="fas fa-check"></i>',
        label: 'Confirm',
        callback: async (html) => {
          const element = html.find('#pmr-dragon-element').val();
          console.log(`${MODULE_ID} | Dragon element selected: ${element} for "${item.name}"`);
          await item.setFlag(MODULE_ID, 'dragonElement', element);
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: 'Cancel',
        callback: () => {
          // Default to fire if cancelled
          item.setFlag(MODULE_ID, 'dragonElement', 'fire');
        },
      },
    },
    default: 'confirm',
  }).render(true);
}

// ─── Compatibility Warnings ──────────────────────────────────────────────────

/**
 * Check for material/item incompatibilities and warn the user.
 */
function validateMaterialCompatibility(materialSlug, grade, category, item) {
  // Wyroot: only wooden weapons (clubs, staves)
  if (materialSlug === 'duskwood' && category === 'weapon') {
    const baseType = item.system.baseItem ?? item.system.slug ?? '';
    const woodenWeapons = ['club', 'staff', 'bo-staff', 'greatclub'];
    if (baseType && !woodenWeapons.some(w => baseType.includes(w))) {
      ui.notifications.warn(game.i18n.localize('PMR.Warnings.WyrootIncompatible'));
    }
  }

  // Singing Steel: only chain or composite armor
  if (materialSlug === 'singing-steel' && category === 'armor') {
    const armorGroup = item.system.group ?? '';
    const compatibleGroups = ['chain', 'composite'];
    if (armorGroup && !compatibleGroups.includes(armorGroup)) {
      ui.notifications.warn(game.i18n.localize('PMR.Warnings.SingingSteelArmorType'));
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Determine the PMR item category from a PF2E item.
 * @param {Item} item - The PF2E item document
 * @returns {'weapon'|'armor'|'shield'|null}
 */
function getItemCategory(item) {
  const type = item.type;
  if (type === 'weapon') return ITEM_CATEGORIES.WEAPON;
  if (type === 'armor') {
    // PF2E distinguishes armor from shields via the category field
    const armorCategory = item.system.category;
    if (armorCategory === 'shield') return ITEM_CATEGORIES.SHIELD;
    return ITEM_CATEGORIES.ARMOR;
  }
  if (type === 'shield') return ITEM_CATEGORIES.SHIELD;
  return null;
}
