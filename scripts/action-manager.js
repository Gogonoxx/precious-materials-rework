/**
 * Action Manager — creates and removes Action Items on Actors.
 *
 * Since PF2E's GrantItem Rule Element refuses to work on physical items
 * (weapons, armor, shields), we manage action items as separate embedded
 * items on the actor, linked via flags.
 */

import { MODULE_ID } from './material-effects.js';

/**
 * Action definitions — the actual item data for each action.
 * These are created as 'action' type items on the actor.
 */
const ACTION_DEFINITIONS = {

  'destructive-counter': {
    name: 'Destructive Counter',
    type: 'action',
    img: 'icons/equipment/shield/heater-crystal-blue.webp',
    system: {
      description: {
        value: `<p><strong>Trigger:</strong> you Shield Block a non-Adamantine melee weapon Strike</p>
<p>Make a Disarm attack, using your Shield Bash or Athletics attack modifier against the target's Fortitude DC. On a Critical Success, you inflict the Broken condition on their weapon instead of knocking it out of their grip (A broken weapon can't be used to Strike until repaired).</p>`,
      },
      actionType: { value: 'reaction' },
      actions: { value: null },
      traits: { value: [] },
      source: { value: 'Precious Materials Rework — Adamantine High Shield' },
    },
  },

  'absorb-life-point': {
    name: 'Absorb Life Point',
    type: 'action',
    img: 'icons/magic/nature/root-vine-entangled-green.webp',
    system: {
      description: {
        value: `<p><strong>Traits:</strong> Necromancy, Plant, Focus</p>
<p><strong>Requirement:</strong> Your held Wyroot weapon has at least 1 Life Point</p>
<p><strong>Frequency:</strong> once per day</p>
<p>You absorb the accumulated Life Points of your weapon, either restoring a Focus Point or reducing your Drained condition by 1 value per Life Point absorbed this way.</p>`,
      },
      actionType: { value: 'action' },
      actions: { value: 1 },
      traits: { value: ['necromancy', 'plant'] },
      source: { value: 'Precious Materials Rework — Wyroot Weapon' },
    },
  },

  'silver-reflection': {
    name: 'Silver Reflection',
    type: 'action',
    img: 'icons/equipment/shield/buckler-wooden-boss-glowing.webp',
    system: {
      description: {
        value: `<p><strong>Trigger:</strong> You Shield Block a Spell effect</p>
<p>Make an attack against the caster of the blocked spell using the highest of your Spell Attack, Shield Bash melee attack, or Thrown Weapon ranged attack. Deal damage equal to the amount negated by your Shield Block on a success, or double that on a Critical Success.</p>`,
      },
      actionType: { value: 'reaction' },
      actions: { value: null },
      traits: { value: [] },
      source: { value: 'Precious Materials Rework — Silver Standard Shield' },
    },
  },

  'true-silver-reflection': {
    name: 'True Silver Reflection',
    type: 'action',
    img: 'icons/equipment/shield/buckler-wooden-boss-glowing.webp',
    system: {
      description: {
        value: `<p><strong>Trigger:</strong> You Shield Block a Spell effect</p>
<p>Silver Reflection returns either the damage blocked or half the effect's total damage, whichever is greater. Regardless of the effect's source, it is returned as Force damage.</p>`,
      },
      actionType: { value: 'reaction' },
      actions: { value: null },
      traits: { value: [] },
      source: { value: 'Precious Materials Rework — Silver High Shield' },
    },
  },

  'soul-counter': {
    name: 'Soul Counter',
    type: 'action',
    img: 'icons/magic/defensive/shield-barrier-glowing-blue.webp',
    system: {
      description: {
        value: `<p><strong>Requirement:</strong> You have a Sovereign Steel Shield raised</p>
<p><strong>Trigger:</strong> A Creature you see casts a spell</p>
<p>You project your willpower through the shield to Counter the opposing spell. Your Counteract Degree is equal to half your level, rounded up, and your Counteract Modifier is equal to your Class DC -10. If you successfully Counteract the spell, you gain the Drained 1 condition. If the Counteract fails, you gain the Drained 2 condition. Drain from Soul Counter stacks, and values in excess of 4 become Doom instead.</p>`,
      },
      actionType: { value: 'reaction' },
      actions: { value: null },
      traits: { value: ['abjuration'] },
      source: { value: 'Precious Materials Rework — Sovereign Steel Standard Shield' },
    },
  },

  'improved-soul-counter': {
    name: 'Improved Soul Counter',
    type: 'action',
    img: 'icons/magic/defensive/shield-barrier-glowing-blue.webp',
    system: {
      description: {
        value: `<p><strong>Requirement:</strong> You have a Sovereign Steel Shield raised</p>
<p><strong>Trigger:</strong> A Creature you see casts a spell</p>
<p>As Soul Counter, but you only gain Drained 1 on failure or success.</p>`,
      },
      actionType: { value: 'reaction' },
      actions: { value: null },
      traits: { value: ['abjuration'] },
      source: { value: 'Precious Materials Rework — Sovereign Steel High Shield' },
    },
  },

  'dispelling-slice': {
    name: 'Dispelling Slice',
    type: 'action',
    img: 'icons/skills/melee/strike-sword-slashing-red.webp',
    system: {
      description: {
        value: `<p><strong>Frequency:</strong> Once until you experience Respite.</p>
<p>Make a Strike and attempt to Counteract a single spell active on the target. Your Counteract is Degree 6, and your modifier is equal to your Class DC -10. If you possess the Rogue Class Feat of the same name, you gain a +2 Circumstance bonus on this Counteract check.</p>`,
      },
      actionType: { value: 'action' },
      actions: { value: 2 },
      traits: { value: ['abjuration'] },
      source: { value: 'Precious Materials Rework — Sovereign Steel Standard Weapon' },
    },
  },

  'improved-dispelling-slice': {
    name: 'Improved Dispelling Slice',
    type: 'action',
    img: 'icons/skills/melee/strike-sword-slashing-red.webp',
    system: {
      description: {
        value: `<p><strong>Frequency:</strong> Once until you experience Respite.</p>
<p>Make a Strike and attempt to Counteract a single spell active on the target. Your Counteract is Degree 10, and your modifier is equal to your Class DC -10. If you possess the Rogue Class Feat of the same name, you gain a +2 Circumstance bonus on this Counteract check.</p>
<p>Sovereign Steel grants a +4 Status bonus to any save an item or its bearer makes to prevent harm from a spell or effect.</p>`,
      },
      actionType: { value: 'action' },
      actions: { value: 2 },
      traits: { value: ['abjuration'] },
      source: { value: 'Precious Materials Rework — Sovereign Steel High Weapon' },
    },
  },

  'armament-across-time': {
    name: 'Armament Across Time',
    type: 'action',
    img: 'icons/magic/time/clock-stopwatch-white-blue.webp',
    system: {
      description: {
        value: `<p><strong>Trigger:</strong> as part of rolling initiative</p>
<p><strong>Frequency:</strong> once per day</p>
<p>Your armor reverts backwards to the last time you donned it as a complete set without magic. The armor equips itself instantly, restores any consumable Talismans equipped to it, and resets its HP if it was damaged. If you possess an Orichalcum Shield or Weapon, they appear equipped in your hands and similarly "reset".</p>`,
      },
      actionType: { value: 'free' },
      actions: { value: null },
      traits: { value: ['divination'] },
      source: { value: 'Precious Materials Rework — Orichalcum High Armor' },
    },
  },

  'aegis-across-time': {
    name: 'Aegis Across Time',
    type: 'action',
    img: 'icons/magic/time/clock-stopwatch-white-blue.webp',
    system: {
      description: {
        value: `<p><strong>Trigger:</strong> you take damage</p>
<p><strong>Frequency:</strong> once per day</p>
<p>You Shield Block an attack that has just struck you, even if your shield is not Raised, you don't have a Reaction, or you are not aware of the attack. After the effects of the attack are resolved, the Orichalcum Shield is restored to full HP. If you are currently wielding an Orichalcum Weapon, make a Space-Rending Slash against the originating source of the attack, irrespective of range.</p>`,
      },
      actionType: { value: 'reaction' },
      actions: { value: null },
      traits: { value: ['divination'] },
      source: { value: 'Precious Materials Rework — Orichalcum High Shield' },
    },
  },

  'space-rending-slash': {
    name: 'Space-Rending Slash',
    type: 'action',
    img: 'icons/magic/time/arrows-circling-green.webp',
    system: {
      description: {
        value: `<p>Stride and Strike, then return to your originating square as if you hadn't moved. The effects of any reactions are negated, though creatures see golden glowing "afterimages" of their potential consequences.</p>`,
      },
      actionType: { value: 'action' },
      actions: { value: 2 },
      traits: { value: ['conjuration', 'teleportation'] },
      source: { value: 'Precious Materials Rework — Orichalcum High Weapon' },
    },
  },

  'unleash-resonance': {
    name: 'Unleash Resonance',
    type: 'action',
    img: 'icons/magic/sonic/bell-alarm-blue-purple.webp',
    system: {
      description: {
        value: `<p><strong>Triggers:</strong> when making a Shield Bash or attacking with forced movement</p>
<p>You release your shield's resonating energy in a blast of concussive sound, knocking the target back 15ft (double on a Critical Success). If you unleash resonance as part of a melee attack that inflicts forced movement (such as Shove or Gigaton Strike), the knockback of Unleash Resonance is cumulative and the target takes 1d6 Bludgeoning damage per 5ft of total knockback if it strikes a solid barrier.</p>`,
      },
      actionType: { value: 'action' },
      actions: { value: 1 },
      traits: { value: ['sonic'] },
      source: { value: 'Precious Materials Rework — Singing Steel High Shield' },
    },
  },
};

export class ActionManager {

  /**
   * Create action items on an actor for a material/grade/category.
   *
   * @param {Actor} actor - The owning actor
   * @param {Item} sourceItem - The weapon/armor/shield that triggered this
   * @param {string} materialSlug - The material slug
   * @param {string} grade - The material grade
   * @param {string} category - 'weapon', 'armor', or 'shield'
   * @param {string[]} actionIds - Array of action definition keys
   */
  static async createActionsForItem(actor, sourceItem, materialSlug, grade, category, actionIds) {
    const itemsToCreate = [];

    for (const actionId of actionIds) {
      const definition = ACTION_DEFINITIONS[actionId];
      if (!definition) {
        console.warn(`${MODULE_ID} | Unknown action definition: ${actionId}`);
        continue;
      }

      // Clone and add flags
      const itemData = foundry.utils.deepClone(definition);
      itemData.flags = {
        [MODULE_ID]: {
          materialAction: true,
          sourceItemId: sourceItem.id,
          actionId,
          materialSlug,
          grade,
          category,
        },
      };

      itemsToCreate.push(itemData);
    }

    if (itemsToCreate.length > 0) {
      const created = await actor.createEmbeddedDocuments('Item', itemsToCreate);
      console.log(`${MODULE_ID} | Created ${created.length} action(s) on actor "${actor.name}" for item "${sourceItem.name}"`);
    }
  }

  /**
   * Remove all PMR action items linked to a specific source item.
   *
   * @param {Actor} actor - The owning actor
   * @param {string} sourceItemId - The ID of the weapon/armor/shield
   */
  static async removeActionsForItem(actor, sourceItemId) {
    const toDelete = actor.items
      .filter(i => i.flags?.[MODULE_ID]?.materialAction && i.flags[MODULE_ID].sourceItemId === sourceItemId)
      .map(i => i.id);

    if (toDelete.length > 0) {
      await actor.deleteEmbeddedDocuments('Item', toDelete);
      console.log(`${MODULE_ID} | Removed ${toDelete.length} action(s) from actor "${actor.name}" for source item ${sourceItemId}`);
    }
  }

  /**
   * Remove ALL PMR action items from an actor.
   * Used for cleanup/debug.
   *
   * @param {Actor} actor - The owning actor
   */
  static async removeAllActions(actor) {
    const toDelete = actor.items
      .filter(i => i.flags?.[MODULE_ID]?.materialAction)
      .map(i => i.id);

    if (toDelete.length > 0) {
      await actor.deleteEmbeddedDocuments('Item', toDelete);
      console.log(`${MODULE_ID} | Removed ALL ${toDelete.length} PMR actions from actor "${actor.name}"`);
    }
  }
}
