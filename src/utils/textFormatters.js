// Mapping of specific card finishes to their display values
export const CARD_FINISH_MAPPING = {
    'REVERSE_HOLO': 'Reverse Holo',
    'HOLOFOIL': 'Holofoil',
    'NORMAL': 'Normal',
    'STAMPED': 'Stamped',
    'FIRST_EDITION': 'First Edition',
    'UNLIMITED': 'Unlimited'
};

// Mapping of card conditions to their display values
export const CARD_CONDITION_MAPPING = {
    'NEAR_MINT': 'Near Mint',
    'LIGHTLY_PLAYED': 'Lightly Played',
    'MODERATELY_PLAYED': 'Moderately Played',
    'HEAVILY_PLAYED': 'Heavily Played',
    'DAMAGED': 'Damaged'
};

// Mapping of card sub types to their display values
export const CARD_SUB_TYPE_MAPPING = {
    'TEAM_PLASMA': 'Team Plasma',
    'BREAK': 'BREAK',
    'V_UNION': 'V-UNION',
    'VMAX': 'VMAX',
    'ROCKETS_SECRET_MACHINE': "Rocket's Secret Machine",
    'ACE_SPEC': 'ACE SPEC',
    'LEVEL_UP': 'Level-Up',
    'POKEMON_TOOL': 'Pokémon Tool',
    'VSTAR': 'VSTAR',
    'TECHNICAL_MACHINE': 'Technical Machine',
    'LEGEND': 'LEGEND',
    'ANCIENT': 'Ancient',
    'SPECIAL': 'Special',
    'TAG_TEAM': 'TAG TEAM',
    'PRIME': 'Prime',
    'SUPPORTER': 'Supporter',
    'RESTORED': 'Restored',
    'STAR': 'Star',
    'STADIUM': 'Stadium',
    'MEGA': 'MEGA',
    'ULTRA_BEAST': 'Ultra Beast',
    'SP': 'SP',
    'RAPID_STRIKE': 'Rapid Strike',
    'V': 'V',
    'POKEMON_TOOL_F': 'Pokémon Tool F',
    'EX': 'ex',
    'ITEM': 'Item',
    'STAGE_2': 'Stage 2',
    'STAGE_1': 'Stage 1',
    'PRISM_STAR': 'Prism Star',
    'FUSION_STRIKE': 'Fusion Strike',
    'BASIC': 'Basic',
    'RADIANT': 'Radiant',
    'EX_UPPER': 'EX',
    'FUTURE': 'Future',
    'ETERNAMAX': 'Eternamax',
    'GX': 'GX',
    'BABY': 'Baby',
    'SINGLE_STRIKE': 'Single Strike',
    'GOLDENROD_GAME_CORNER': 'Goldenrod Game Corner',
    'TERA': 'Tera'
};

// Mapping of card types to their display values
export const CARD_TYPE_MAPPING = {
    'GRASS': 'Grass',
    'FIRE': 'Fire',
    'WATER': 'Water',
    'LIGHTNING': 'Lightning',
    'FIGHTING': 'Fighting',
    'PSYCHIC': 'Psychic',
    'COLORLESS': 'Colorless',
    'DARKNESS': 'Darkness',
    'METAL': 'Metal',
    'DRAGON': 'Dragon',
    'FAIRY': 'Fairy'
};

export const CARD_RARITY_MAPPING = {
    'HYPER_RARE': 'Hyper Rare',
    'RARE': 'Rare',
    'RARE_HOLO_LVX': 'Rare Holo LV.X',
    'SPECIAL_ILLUSTRATION_RARE': 'Special Illustration Rare',
    'RARE_HOLO_STAR': 'Rare Holo Star',
    'ILLUSTRATION_RARE': 'Illustration Rare',
    'SHINY_ULTRA_RARE': 'Shiny Ultra Rare',
    'RARE_SHINY': 'Rare Shiny',
    'RARE_HOLO_GX': 'Rare Holo GX',
    'LEGEND': 'LEGEND',
    'CLASSIC_COLLECTION': 'Classic Collection',
    'DOUBLE_RARE': 'Double Rare',
    'RARE_BREAK': 'Rare BREAK',
    'RARE_HOLO_V': 'Rare Holo V',
    'RARE_PRISM_STAR': 'Rare Prism Star',
    'ACE_SPEC_RARE': 'ACE SPEC Rare',
    'RARE_RAINBOW': 'Rare Rainbow',
    'COMMON': 'Common',
    'RADIANT_RARE': 'Radiant Rare',
    'RARE_PRIME': 'Rare Prime',
    'RARE_HOLO_VSTAR': 'Rare Holo VSTAR',
    'AMAZING_RARE': 'Amazing Rare',
    'RARE_HOLO_VMAX': 'Rare Holo VMAX',
    'RARE_SECRET': 'Rare Secret',
    'RARE_ULTRA': 'Rare Ultra',
    'UNCOMMON': 'Uncommon',
    'RARE_ACE': 'Rare ACE',
    'SHINY_RARE': 'Shiny Rare',
    'ULTRA_RARE': 'Ultra Rare',
    'RARE_HOLO_EX': 'Rare Holo EX',
    'RARE_HOLO': 'Rare Holo',
    'RARE_SHINY_GX': 'Rare Shiny GX',
    'RARE_SHINING': 'Rare Shining',
    'TRAINER_GALLERY_RARE_HOLO': 'Trainer Gallery Rare Holo',
    'PROMO': 'Promo'
}

export const CARD_SERIES_MAPPING = {
    'XY': 'XY',
    'HEARTGOLD_AND_SOULSILVER': 'HeartGold & SoulSilver',
    'OTHER': 'Other',
    'NEO': 'Neo',
    'SWORD_AND_SHIELD': 'Sword & Shield',
    'POP': 'POP',
    'NP': 'NP',
    'SUN_AND_MOON': 'Sun & Moon',
    'EX': 'EX',
    'PLATINUM': 'Platinum',
    'DIAMOND_AND_PEARL': 'Diamond & Pearl',
    'BASE': 'Base',
    'E_CARD': 'E-Card',
    'BLACK_AND_WHITE': 'Black & White',
    'GYM': 'Gym',
    'SCARLET_AND_VIOLET': 'Scarlet & Violet',
}

/**
 * Formats a string to be more human readable by:
 * - Capitalizing the first letter of each word
 * - Converting hyphens and underscores to spaces
 * @param {string} text - The text to format
 * @returns {string} The formatted text
 */
export const formatCardText = (text) => {
    if (!text) return '';
    return text
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Formats a card finish using predefined mappings or falls back to basic text formatting
 * @param {string} finish - The card finish to format
 * @returns {string} The formatted finish text
 */
export const formatCardFinish = (finish) => {
    if (!finish) return '';
    return CARD_FINISH_MAPPING[finish] || formatCardText(finish);
};

/**
 * Formats a card condition using predefined mappings or falls back to basic text formatting
 * @param {string} condition - The card condition to format
 * @returns {string} The formatted condition text
 */
export const formatCardCondition = (condition) => {
    if (!condition) return '';
    return CARD_CONDITION_MAPPING[condition] || formatCardText(condition);
};

/**
 * Formats a card rarity using predefined mappings or falls back to basic text formatting
 * @param {string} rarity - The card rarity to format
 * @returns {string} The formatted rarity text
 */
export const formatCardRarity = (rarity) => {
    if (!rarity) return '';
    return CARD_RARITY_MAPPING[rarity] || formatCardText(rarity);
};

/**
 * Formats a card rarity using predefined mappings or falls back to basic text formatting
 * @param {string} rarity - The card rarity to format
 * @returns {string} The formatted rarity text
 */
export const formatCardSubtype = (subtype) => {
    if (!subtype) return '';
    return CARD_SUB_TYPE_MAPPING[subtype] || formatCardText(subtype);
};

/**
 * Maps resistance modifiers to their display symbols
 * @param {string} modifier - The resistance modifier (MULTIPLY, ADD, REDUCE, PERCENTAGE)
 * @returns {string} The corresponding symbol (×, +, -, %)
 */
export const formatModifier = (modifier) => {
    const modifierMap = {
        MULTIPLY: '×',
        ADD: '+',
        REDUCE: '-',
        PERCENTAGE: '%'
    };
    return modifierMap[modifier] || modifier;
};

/**
 * Formats a date string from YYYY-MM-DD to Month DD, YYYY
 * @param {string} dateStr - The date string to format
 * @returns {string} The formatted date string
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
};