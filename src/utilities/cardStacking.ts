import { LovelaceCardConfig } from '../types/homeassistant/data/lovelace/config/card';
import { StackCardConfig } from '../types/homeassistant/panels/lovelace/cards/types';

// noinspection GrazieInspection
/**
 * Stacks an array of Lovelace card configurations into horizontal stacks based on their type.
 *
 * This method processes sequences of cards with the same type and applies a specified column count
 * for each type of card.
 * It returns a new array of stacked card configurations, preserving the original order of the cards.
 *
 * @param cardConfigurations - An array of Lovelace card configurations to be stacked.
 * @param defaultCount - The default number of cards to stack if the type or column count is not found in the mapping.
 * @param [columnCounts] - An object mapping card types to their respective column counts.
 *                         If a type is not found in the mapping, it defaults to 2.
 * @returns An array of stacked card configurations, where each configuration is a horizontal stack
 *          containing a specified number of cards.
 *
 * @example
 * ```typescript
 * stackedCards = stackHorizontal(card, 2, {area: 1, 'custom:card': 2});
 * ```
 */
export function stackHorizontal(
  cardConfigurations: LovelaceCardConfig[],
  defaultCount: number = 2,
  columnCounts?: {
    [key: string]: number | undefined;
  },
): LovelaceCardConfig[] {
  if (cardConfigurations.length <= 1) {
    return cardConfigurations;
  }

  // Function to process a sequence of cards
  const doStack = (cards: LovelaceCardConfig[], columnCount: number) => {
    if (cards.length <= 1) {
      return cards;
    }

    const stackedCardConfigurations: StackCardConfig[] = [];

    for (let i = 0; i < cards.length; i += columnCount) {
      stackedCardConfigurations.push({
        type: 'horizontal-stack',
        cards: cards.slice(i, i + columnCount),
      } as StackCardConfig);
    }

    return stackedCardConfigurations;
  };

  // Array to hold the processed cards
  const processedConfigurations: LovelaceCardConfig[] = [];

  for (let i = 0; i < cardConfigurations.length; ) {
    const currentCard = cardConfigurations[i];
    const currentType = currentCard.type;

    // Start a new sequence
    const sequence: LovelaceCardConfig[] = [];

    // Collect all cards of the same type into the sequence
    while (i < cardConfigurations.length && cardConfigurations[i].type === currentType) {
      sequence.push(cardConfigurations[i]);
      i++; // Move to the next card
    }

    const columnCount = Math.max(columnCounts?.[currentType] || defaultCount, 1);

    // Process the sequence and add the result to the processedConfigurations array
    processedConfigurations.push(...doStack(sequence, columnCount));
  }

  return processedConfigurations;
}
