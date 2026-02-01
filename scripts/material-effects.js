/**
 * Material Effects Lookup Table
 *
 * Structure: MATERIAL_EFFECTS[materialSlug][grade][itemCategory]
 * Each entry contains:
 *   - rules: Array of Rule Element definitions to inject
 *   - actions: Array of action references to create as embedded items
 *   - notes: Array of text notes for GM reference
 */

export const MODULE_ID = 'precious-materials-rework';

export const ITEM_CATEGORIES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  SHIELD: 'shield',
};

/**
 * Maps PF2E system slugs to our internal material identifiers.
 * Most materials use the PF2E remaster slug directly.
 */
export const MATERIAL_SLUGS = {
  adamantine: 'adamantine',
  'cold-iron': 'cold-iron',
  duskwood: 'duskwood',         // Darkwood in remaster
  djezet: 'djezet',
  dragonhide: 'dragonhide',     // Dragoncraft
  dawnsilver: 'dawnsilver',     // Mithral in remaster
  orichalcum: 'orichalcum',
  silver: 'silver',
  'sovereign-steel': 'sovereign-steel',
  throneglass: 'throneglass',   // Custom — needs registration
  'singing-steel': 'singing-steel', // Custom — needs registration
};

// ─── Material Effects Table ──────────────────────────────────────────────────

export const MATERIAL_EFFECTS = {

  // ═══════════════════════════════════════════════════════════════════════════
  // ADAMANTINE
  // ═══════════════════════════════════════════════════════════════════════════
  adamantine: {
    standard: {
      armor: {
        rules: [
          {
            key: 'Resistance',
            type: 'physical',
            value: 2,
            label: 'PMR: Adamantine Armor (Physical Resist)',
          },
        ],
        actions: [],
        notes: [
          'Armor can only be damaged/broken by a single blow that would destroy it.',
          '+1 Bulk.',
        ],
      },
      shield: {
        rules: [],
        actions: [],
        notes: [
          '+2 Hardness (manual adjustment).',
          '+1 Bulk.',
          'Indestructible: can only be damaged by a blow that would break it in one hit.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Adamantine — Ignore 5 Hardness of non-Adamantine objects.',
            outcome: ['success', 'criticalSuccess'],
          },
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Shattering Blow (Alt Crit) — If target wears armor: Broken condition. Penalty: -1 light, -2 medium, -3 heavy.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: [
          'Ignore 5 Hardness of non-Adamantine objects.',
          'Alt Crit: Shattering Blow — Broken condition on target armor.',
        ],
      },
    },
    high: {
      armor: {
        rules: [
          {
            key: 'Resistance',
            type: 'physical',
            value: 6,
            label: 'PMR: Adamantine Armor (Physical Resist)',
          },
        ],
        actions: [],
        notes: [
          'Armor can only be damaged/broken by a single blow that would destroy it.',
          '+1 Bulk.',
        ],
      },
      shield: {
        rules: [],
        actions: ['destructive-counter'],
        notes: [
          '+6 Hardness (manual adjustment).',
          '+1 Bulk.',
          'Indestructible.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Adamantine — Ignore 15 Hardness of non-Adamantine objects.',
            outcome: ['success', 'criticalSuccess'],
          },
        ],
        actions: [],
        notes: ['Ignore 15 Hardness of non-Adamantine objects.'],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COLD IRON
  // ═══════════════════════════════════════════════════════════════════════════
  'cold-iron': {
    low: {
      armor: {
        rules: [
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Cold Iron — Creatures vulnerable to Cold Iron are Sickened 1 on Crit Fail melee Strike. Armor Specialization applies against all Strikes from such creatures.',
          },
        ],
        actions: [],
        notes: ['Repels creatures vulnerable to Cold Iron.'],
      },
      shield: {
        rules: [],
        actions: [],
        notes: ['+2 Hardness vs. Spells (conditional, manual).'],
      },
      weapon: {
        rules: [],
        actions: [],
        notes: ['Triggers Cold Iron weaknesses (handled by PF2E system).'],
      },
    },
    standard: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 1,
            type: 'circumstance',
            label: 'PMR: Cold Iron Armor (vs Chaos/Evil/Good/Mental/Negative)',
            predicate: [
              {
                or: [
                  'item:trait:chaotic',
                  'item:trait:evil',
                  'item:trait:good',
                  'item:trait:mental',
                  'item:trait:negative',
                ],
              },
            ],
          },
        ],
        actions: [],
        notes: ['+1 circumstance to saves vs Chaos/Evil/Good/Mental/Negative spells.'],
      },
      shield: {
        rules: [],
        actions: [],
        notes: ['+4 Hardness vs. Spells (conditional, manual).'],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Burning Agony (Alt Crit) — Non-Lawful Outsider or Cold Iron vulnerable target: Fort save vs Class DC. Success: Sickened 1, Fail: Sickened 2, Crit Fail: Sickened 2 + Stunned 1.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: ['Alt Crit: Burning Agony — Fort save vs Class DC.'],
      },
    },
    high: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 2,
            type: 'circumstance',
            label: 'PMR: Cold Iron High Armor (vs Chaos/Evil/Good/Mental/Negative)',
            predicate: [
              {
                or: [
                  'item:trait:chaotic',
                  'item:trait:evil',
                  'item:trait:good',
                  'item:trait:mental',
                  'item:trait:negative',
                ],
              },
            ],
          },
          {
            key: 'AdjustDegreeOfSuccess',
            selector: 'saving-throw',
            adjustment: { success: 'one-degree-better' },
            predicate: [
              {
                or: [
                  'item:trait:chaotic',
                  'item:trait:evil',
                  'item:trait:good',
                  'item:trait:mental',
                  'item:trait:negative',
                ],
              },
            ],
          },
        ],
        actions: [],
        notes: [
          '+2 circumstance to saves vs Chaos/Evil/Good/Mental/Negative spells.',
          'Success → Critical Success. With Evasion-like feature: halve damage on Fail, Crit Fail → Fail.',
        ],
      },
      shield: {
        rules: [],
        actions: [],
        notes: ['+8 Hardness vs. Spells (conditional, manual).'],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Burning Agony (Alt Crit) +3 Item Bonus to DC — Fort save vs Class DC +3. Success: Sickened 1, Fail: Sickened 2, Crit Fail: Sickened 2 + Stunned 1.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: ['Alt Crit: Burning Agony with +3 Item Bonus to DC.'],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DARKWOOD (duskwood in PF2E remaster)
  // ═══════════════════════════════════════════════════════════════════════════
  duskwood: {
    standard: {
      armor: {
        rules: [
          {
            key: 'Resistance',
            type: 'bludgeoning',
            value: 4,
            label: 'PMR: Darkwood Armor (Bludgeoning Resist)',
          },
          {
            key: 'Resistance',
            type: 'piercing',
            value: 4,
            label: 'PMR: Darkwood Armor (Piercing Resist)',
          },
          {
            key: 'Weakness',
            type: 'fire',
            value: 5,
            label: 'PMR: Darkwood Armor (Fire Weakness)',
          },
        ],
        actions: [],
        notes: [
          'Reduce Strength threshold by 2, Bulk by 1.',
          'Druids can wear without violating Anathema.',
          'Bludgeoning/Piercing Resist stacks with Armor Specialization but NOT Barkskin.',
        ],
      },
      shield: {
        rules: [],
        actions: [],
        notes: [
          '-1 Bulk.',
          '50% Positive Healing (Greenwood shield is still alive).',
          'Can be healed by positive energy and Repaired with Nature.',
          'Recovers HP = item Level per day with water and sunlight.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Life-Sapping Strike (Alt Crit) — Wyroot weapon gains 1 Life Point (capacity 1). Wielder gains Absorb Life Point action.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: ['absorb-life-point'],
        notes: [
          'Wyroot weapons only — requires wooden striking surface (clubs, staves).',
          'Alt Crit: Life-Sapping Strike (Capacity 1).',
        ],
      },
    },
    high: {
      armor: {
        rules: [
          {
            key: 'Resistance',
            type: 'bludgeoning',
            value: 10,
            label: 'PMR: Darkwood High Armor (Bludgeoning Resist)',
          },
          {
            key: 'Resistance',
            type: 'piercing',
            value: 10,
            label: 'PMR: Darkwood High Armor (Piercing Resist)',
          },
        ],
        actions: [],
        notes: [
          'No Fire Weakness at High-Grade.',
          'Reduce Strength threshold by 2, Bulk by 1.',
          'Bludgeoning/Piercing Resist 10 + Armor Specialization.',
        ],
      },
      shield: {
        rules: [],
        actions: [],
        notes: [
          '-1 Bulk.',
          '100% Positive Healing.',
          'Can be healed by positive energy and Repaired with Nature.',
          'Recovers HP = item Level per day with water and sunlight.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Life-Sapping Strike (Alt Crit) — Wyroot weapon gains 1 Life Point (capacity 3). Wielder gains Absorb Life Point action.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: ['absorb-life-point'],
        notes: [
          'Wyroot weapons only — requires wooden striking surface.',
          'Alt Crit: Life-Sapping Strike (Capacity 3).',
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DJEZET
  // ═══════════════════════════════════════════════════════════════════════════
  djezet: {
    high: {
      armor: {
        rules: [
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Djezet Infusion — +1 Rune Capacity on this armor.',
          },
        ],
        actions: [],
        notes: ['+1 Rune Capacity. Also functions as Legendary Crafting Ingredient if base material is common.'],
      },
      shield: {
        rules: [
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Djezet Infusion — +1 Rune Capacity on this shield.',
          },
        ],
        actions: [],
        notes: ['+1 Rune Capacity.'],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Djezet Infusion — +1 Rune Capacity on this weapon.',
            outcome: ['success', 'criticalSuccess'],
          },
        ],
        actions: [],
        notes: ['+1 Rune Capacity.'],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DRAGONCRAFT (dragonhide in PF2E)
  // ═══════════════════════════════════════════════════════════════════════════
  dragonhide: {
    standard: {
      armor: {
        rules: [
          // Resistance is element-dependent — type set dynamically in rule-builder.js
          {
            key: 'Resistance',
            type: 'fire', // Default, overridden dynamically
            value: 5,
            label: 'PMR: Dragonhide Armor (Element Resist)',
            _pmr_dynamic: 'dragonElement_resistance',
          },
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 2,
            type: 'circumstance',
            label: 'PMR: Dragonhide Armor (vs energy type)',
            // Predicate will be set dynamically based on chosen element
            _pmr_dynamic: 'dragonElement',
          },
        ],
        actions: [],
        notes: [
          'Resist 5 to chosen dragon element.',
          '+2 circumstance to saves vs chosen energy type.',
          'Druids can wear without violating Anathema.',
          'Element chosen on craft/application via dialog.',
        ],
      },
      shield: {
        rules: [],
        actions: [],
        notes: [
          '+8 Hardness vs chosen dragon element (conditional, manual).',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Draconic Frenzy (Alt Crit) — Strike again as Free Action at -5 MAP (-4 if Agile). Does not increase MAP. Once per round.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: ['Alt Crit: Draconic Frenzy — free Strike at -5 MAP.'],
      },
    },
    high: {
      armor: {
        rules: [
          {
            key: 'Resistance',
            type: 'fire', // Default, overridden dynamically
            value: 10,
            label: 'PMR: Dragonhide High Armor (Element Resist)',
            _pmr_dynamic: 'dragonElement_resistance',
          },
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 2,
            type: 'circumstance',
            label: 'PMR: Dragonhide High Armor (vs energy type)',
            _pmr_dynamic: 'dragonElement',
          },
          {
            key: 'AdjustDegreeOfSuccess',
            selector: 'saving-throw',
            adjustment: { success: 'one-degree-better' },
            _pmr_dynamic: 'dragonElement',
          },
        ],
        actions: [],
        notes: [
          'Resist 10 to chosen dragon element.',
          '+2 circumstance to saves vs chosen energy type.',
          'Success → Crit Success. With Evasion: halve damage on Fail, Crit Fail → Fail.',
          'Fortification effect.',
        ],
      },
      shield: {
        rules: [],
        actions: [],
        notes: ['+16 Hardness vs chosen dragon element (conditional, manual).'],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Draconic Frenzy (Alt Crit) — Strike again as Free Action at -5 MAP (-4 if Agile). Once per round.',
            outcome: ['criticalSuccess'],
          },
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Bloodthirsty — Reduce MAP by 1 (or 2 for tertiary), stacks with Agile.',
            outcome: ['success', 'criticalSuccess'],
          },
        ],
        actions: [],
        notes: [
          'Alt Crit: Draconic Frenzy.',
          'Bloodthirsty: MAP reduced by 1 (2 for tertiary).',
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MITHRAL (dawnsilver in PF2E remaster)
  // ═══════════════════════════════════════════════════════════════════════════
  dawnsilver: {
    standard: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'escape',
            value: 2,
            type: 'item',
            label: 'PMR: Mithral Armor (Escape Bonus)',
          },
          {
            key: 'FlatModifier',
            selector: 'speed',
            value: 5,
            type: 'status',
            label: 'PMR: Mithral Armor (Speed Bonus)',
          },
        ],
        actions: [],
        notes: [
          'Reduce Bulk by 1, Strength threshold by 2, speed penalty by 5ft.',
          '+2 item bonus to Escape checks.',
          '+5ft status bonus to speeds.',
          'Light Mithral Armor can be worn beneath clothing.',
        ],
      },
      shield: {
        rules: [
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Mithral Shield — Avert Gaze as Stance (free after first round). Spotlight: illuminate any square within 120ft as part of Seek.',
          },
        ],
        actions: [],
        notes: [
          '-1 Bulk.',
          'Avert Gaze as Stance.',
          'Spotlight: illuminate square within 120ft with Seek.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Functions as low-grade Silver vs Weaknesses/Resistances.',
            outcome: ['success', 'criticalSuccess'],
          },
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Blinding Flash (Alt Crit) — In Bright Light: target is Blinded for 1 round.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: [
          'Functions as low-grade Silver.',
          'Alt Crit: Blinding Flash — Blinded 1 round (Bright Light required).',
        ],
      },
    },
    high: {
      armor: {
        rules: [
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Mithral High Armor — Freedom of Movement + Longstrider (constant). When Quickened, Stride as Free Action.',
          },
        ],
        actions: [],
        notes: [
          'Freedom of Movement + Longstrider (constant effects).',
          'When Quickened: immediate Stride as Free Action.',
          'Reduce Bulk by 1, Strength threshold by 2.',
        ],
      },
      shield: {
        rules: [
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Mithral High Shield — Swift Block: can Shield Block without Raising Shield.',
          },
        ],
        actions: [],
        notes: [
          '-1 Bulk.',
          'Swift Block: Shield Block without Raise Shield.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Functions as low-grade Silver vs Weaknesses/Resistances.',
            outcome: ['success', 'criticalSuccess'],
          },
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Blinding Flash (Alt Crit) +2 Item Bonus to DC — Target Blinded 1 round. Works in Dim Light.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: [
          'Functions as low-grade Silver.',
          'Alt Crit: Blinding Flash +2 Item Bonus to DC. Works in Dim Light.',
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ORICHALCUM
  // ═══════════════════════════════════════════════════════════════════════════
  orichalcum: {
    high: {
      armor: {
        rules: [
          {
            key: 'RollTwice',
            selector: 'initiative',
            keep: 'higher',
            label: 'PMR: Orichalcum Armor (Initiative Fortune)',
          },
          {
            key: 'Note',
            selector: 'initiative',
            text: 'PMR: Orichalcum — Never surprised by ambush.',
          },
        ],
        actions: ['armament-across-time'],
        notes: [
          'Initiative Fortune (roll twice, keep higher).',
          'Never surprised by ambush.',
          'Bearer stops aging while wearing part of the armor.',
          'Armor resets to complete unclaimed set 1 day after bearer dies.',
        ],
      },
      shield: {
        rules: [],
        actions: ['aegis-across-time'],
        notes: [
          '+2 Hardness (manual adjustment).',
          'If destroyed, reforms after 1 day.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Thief of Time (Alt Crit) — You become Quickened 1, target becomes Slowed 1, each for 1 minute. No restrictions on Quickened actions.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: ['space-rending-slash'],
        notes: ['Alt Crit: Thief of Time — Quickened 1 / Slowed 1 for 1 minute.'],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SILVER
  // ═══════════════════════════════════════════════════════════════════════════
  silver: {
    low: {
      armor: {
        rules: [
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Silver — Creatures vulnerable to Silver are Sickened 1 on Crit Fail melee Strike. Armor Specialization applies against all Strikes from such creatures.',
          },
        ],
        actions: [],
        notes: ['Repels creatures vulnerable to Silver (parallels Cold Iron Low).'],
      },
      shield: {
        rules: [
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Silver Shield — Can Shield Block Alignment, Mental, Poison, or Negative damage.',
          },
        ],
        actions: [],
        notes: ['Can Shield Block Alignment/Mental/Poison/Negative damage.'],
      },
      weapon: {
        rules: [],
        actions: [],
        notes: ['Triggers Silver weaknesses (handled by PF2E system).'],
      },
    },
    standard: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 1,
            type: 'circumstance',
            label: 'PMR: Silver Armor (vs Curse/Darkness/Death/Evil/Shadow)',
            predicate: [
              {
                or: [
                  'item:trait:curse',
                  'item:trait:darkness',
                  'item:trait:death',
                  'item:trait:evil',
                  'item:trait:shadow',
                ],
              },
            ],
          },
        ],
        actions: [],
        notes: ['+1 circumstance to saves vs Curse/Darkness/Death/Evil/Shadow.'],
      },
      shield: {
        rules: [],
        actions: ['silver-reflection'],
        notes: ['Silver Reflection action.'],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Burning Agony (Alt Crit) — Undead target: Fort save vs Class DC. Success: Sickened 1, Fail: Sickened 2, Crit Fail: Sickened 2 + Stunned 1.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: ['Alt Crit: Burning Agony — Fort save vs Class DC (vs Undead).'],
      },
    },
    high: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 2,
            type: 'circumstance',
            label: 'PMR: Silver High Armor (vs Curse/Darkness/Death/Evil/Shadow)',
            predicate: [
              {
                or: [
                  'item:trait:curse',
                  'item:trait:darkness',
                  'item:trait:death',
                  'item:trait:evil',
                  'item:trait:shadow',
                ],
              },
            ],
          },
          {
            key: 'AdjustDegreeOfSuccess',
            selector: 'saving-throw',
            adjustment: { success: 'one-degree-better' },
            predicate: [
              {
                or: [
                  'item:trait:curse',
                  'item:trait:darkness',
                  'item:trait:death',
                  'item:trait:evil',
                  'item:trait:shadow',
                ],
              },
            ],
          },
        ],
        actions: [],
        notes: [
          '+2 circumstance, Success → Crit Success.',
          'With Evasion: halve damage on Fail, Crit Fail → Fail.',
        ],
      },
      shield: {
        rules: [],
        actions: ['true-silver-reflection'],
        notes: ['True Silver Reflection action.'],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Burning Agony (Alt Crit) +3 Item Bonus to DC — Undead target: Fort save vs Class DC +3. Success: Sickened 1, Fail: Sickened 2, Crit Fail: Sickened 2 + Stunned 1.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: ['Alt Crit: Burning Agony +3 Item Bonus to DC (vs Undead).'],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOVEREIGN STEEL
  // ═══════════════════════════════════════════════════════════════════════════
  'sovereign-steel': {
    standard: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 1,
            type: 'circumstance',
            label: 'PMR: Sovereign Steel Armor (vs magical effects)',
            predicate: ['magical'],
          },
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Sovereign Steel Armor — DC 6 Flat Check when casting or spell is disrupted. Armor Spec resistance applies vs spell damage.',
          },
        ],
        actions: [],
        notes: [
          '+1 circumstance to saves vs magical effects.',
          'DC 6 Flat Check when casting a spell or it is disrupted.',
          'Armor Specialization resistance applies vs spell damage.',
        ],
      },
      shield: {
        rules: [],
        actions: ['soul-counter'],
        notes: ['Soul Counter action.'],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Functions as Cold Iron vs Weaknesses/Resistances.',
            outcome: ['success', 'criticalSuccess'],
          },
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Spellbreaker (Alt Crit) — Target must DC 8 flat check to use/sustain magic until end of your next turn.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: ['dispelling-slice'],
        notes: [
          'Functions as Cold Iron vs Weaknesses/Resistances.',
          'Alt Crit: Spellbreaker — DC 8 flat check for target to use magic.',
          'Dispelling Slice action.',
        ],
      },
    },
    high: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 2,
            type: 'circumstance',
            label: 'PMR: Sovereign Steel High Armor (vs magical effects)',
            predicate: ['magical'],
          },
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Sovereign Steel Armor — DC 6 Flat Check when casting or spell is disrupted.',
          },
          {
            key: 'Note',
            selector: 'saving-throw',
            text: 'PMR: Sovereign Steel High — On Crit Success vs magical effect: gain temp HP = Level of caster item/creature. +4 status bonus to saves vs spell harm.',
            predicate: ['magical'],
          },
        ],
        actions: [],
        notes: [
          '+2 circumstance to saves vs magical effects.',
          'DC 6 Flat Check when casting.',
          'Crit Success vs magic → temp HP = caster level.',
          '+4 status bonus to saves vs spell harm to item/bearer.',
        ],
      },
      shield: {
        rules: [],
        actions: ['improved-soul-counter'],
        notes: ['Improved Soul Counter action.'],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Functions as Cold Iron vs Weaknesses/Resistances.',
            outcome: ['success', 'criticalSuccess'],
          },
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Spellbreaker (Alt Crit) — Target must DC 11 flat check to use/sustain magic until end of your next turn.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: ['improved-dispelling-slice'],
        notes: [
          'Functions as Cold Iron.',
          'Alt Crit: Spellbreaker DC 11.',
          'Improved Dispelling Slice (Counteract Degree 10).',
          '+4 status bonus to saves vs spell harm.',
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // THRONEGLASS (custom material — needs registration)
  // ═══════════════════════════════════════════════════════════════════════════
  throneglass: {
    standard: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 2,
            type: 'circumstance',
            label: 'PMR: Throneglass Armor (vs Mental)',
            predicate: ['item:trait:mental'],
          },
          {
            key: 'Note',
            selector: 'saving-throw',
            text: 'PMR: Throneglass — When inflicted with Stupefied, reduce severity by 1.',
          },
        ],
        actions: [],
        notes: [
          '+2 circumstance to saves vs Mental effects.',
          'Reduce Stupefied severity by 1.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Resonant trait — Compatible only with Mental damage. Befuddling Blow (Alt Crit): Stupefied 1 until start of next turn (Stupefied 2 if charged with Mental energy).',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: [
          'Resonant trait (Mental damage only).',
          'Alt Crit: Befuddling Blow — Stupefied 1 (or 2 if charged).',
        ],
      },
    },
    high: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 2,
            type: 'circumstance',
            label: 'PMR: Throneglass High Armor (vs Mental)',
            predicate: ['item:trait:mental'],
          },
          {
            key: 'Note',
            selector: 'saving-throw',
            text: 'PMR: Throneglass High — Absorbs single-target Mental spells on Success/Crit Success. Stored for rounds = spell degree. Can re-cast using original DC.',
          },
        ],
        actions: [],
        notes: [
          '+2 circumstance vs Mental.',
          'Absorb single-target Mental spells on Success. Store and re-cast.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Befuddling Blow (Alt Crit) — Stupefied stacks with other sources, up to Stupefied 4.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: [
          'Resonant trait.',
          'Alt Crit: Befuddling Blow — Stacking Stupefied (up to 4).',
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SINGING STEEL (custom material — needs registration)
  // ═══════════════════════════════════════════════════════════════════════════
  'singing-steel': {
    high: {
      armor: {
        rules: [
          {
            key: 'FlatModifier',
            selector: 'saving-throw',
            value: 3,
            type: 'circumstance',
            label: 'PMR: Singing Steel Armor (vs Sonic/Auditory)',
            predicate: [
              {
                or: [
                  'item:trait:sonic',
                  'item:trait:auditory',
                ],
              },
            ],
          },
          {
            key: 'Note',
            selector: 'ac',
            text: 'PMR: Singing Steel Armor — Shout clearly up to 1000ft. Auditory auras/actions/spells: +50% range/radius. Double Armor Specialization vs Sonic.',
          },
        ],
        actions: [],
        notes: [
          'Only Chain or Composite armor.',
          '+3 circumstance vs Sonic/Auditory (stacks with Well-Versed).',
          'Shout up to 1000ft.',
          'Auditory trait: +50% range/radius.',
          'Double Armor Specialization vs Sonic.',
        ],
      },
      shield: {
        rules: [],
        actions: ['unleash-resonance'],
        notes: [
          'When used to Shield Block, begins to Resonate.',
          'Resonance fades after 1 minute.',
          'Can maintain Resonance as Exploration Activity.',
        ],
      },
      weapon: {
        rules: [
          {
            key: 'Note',
            selector: 'strike-damage',
            text: 'PMR: Clangorous Impact (Alt Crit) — Target Fort save vs Class DC. Success: Deafened 1 min. Fail: Deafened permanently + Stunned 1. Crit Fail: Stunned 2. Greater Thundering: Potency as Item Bonus to DC.',
            outcome: ['criticalSuccess'],
          },
        ],
        actions: [],
        notes: ['Alt Crit: Clangorous Impact — Deafened + Stunned.'],
      },
    },
  },
};
