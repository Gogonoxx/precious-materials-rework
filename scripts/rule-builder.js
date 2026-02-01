/**
 * Rule Builder — constructs PF2E Rule Element objects from material effect definitions.
 *
 * Each Rule Element gets tagged with the module flag so it can be identified
 * and removed when the material changes.
 */

import { MODULE_ID } from './material-effects.js';

const PMR_FLAG = `flags.${MODULE_ID}`;

/**
 * Build an array of PF2E Rule Elements for a given material/grade/category.
 *
 * @param {string} materialSlug - The PF2E material slug
 * @param {string} grade - 'low', 'standard', or 'high'
 * @param {string} category - 'weapon', 'armor', or 'shield'
 * @param {object} effects - The effects definition from MATERIAL_EFFECTS
 * @param {Item} item - The PF2E item (for dynamic lookups like dragon element)
 * @returns {object[]} Array of Rule Element objects ready for system.rules[]
 */
export function buildRulesForMaterial(materialSlug, grade, category, effects, item) {
  if (!effects?.rules?.length) return [];

  const rules = [];

  for (const template of effects.rules) {
    const rule = buildSingleRule(template, materialSlug, grade, category, item);
    if (rule) rules.push(rule);
  }

  return rules;
}

/**
 * Build a single Rule Element from a template definition.
 * Handles dynamic elements (e.g., dragon element selection).
 */
function buildSingleRule(template, materialSlug, grade, category, item) {
  // Deep clone the template to avoid mutating the original
  const rule = foundry.utils.deepClone(template);

  // Tag with module flag for identification
  rule[PMR_FLAG] = true;

  // Set label if not present
  if (!rule.label && rule.key !== 'Note') {
    rule.label = `PMR: ${materialSlug} ${grade} ${category}`;
  }

  // Handle dynamic Dragonhide rules
  if (rule._pmr_dynamic) {
    const element = item.flags?.[MODULE_ID]?.dragonElement || 'fire';

    if (rule._pmr_dynamic === 'dragonElement') {
      // Set predicate to match the chosen element trait
      rule.predicate = [`item:trait:${element}`];
    } else if (rule._pmr_dynamic === 'dragonElement_resistance') {
      // Set resistance type to the chosen element
      rule.type = element;
      rule.label = `PMR: Dragonhide Armor (${capitalize(element)} Resist ${rule.value})`;
    }

    delete rule._pmr_dynamic;
  }

  return rule;
}

/**
 * Capitalize the first letter of a string.
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
