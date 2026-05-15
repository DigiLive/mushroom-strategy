import { LovelaceViewConfig } from '../homeassistant/data/lovelace/config/view';
import { CustomHeaderCardConfig } from './strategy-cards';
import { SupportedDomains } from './strategy-generics';
import AbstractView from '../../views/AbstractView';

/**
 * Options for the extended View class.
 *
 * @property {StrategyHeaderCardConfig} [headerCardConfiguration] - Options for the Header card.
 */
export interface ViewConfig extends LovelaceViewConfig {
  headerCardConfiguration?: CustomHeaderCardConfig;
}

/**
 * Interface for constructors of AbstractView subclasses.
 *
 * Defines the constructor signature that accepts optional view configuration and the static domain property that
 * identifies which domain the view represents.
 *
 * @property {SupportedDomains | "home"} domain - The domain which the view is representing.
 * @param {ViewConfig} [customConfiguration] - Optional custom view configuration.
 */
export interface ViewConstructor {
  domain: SupportedDomains | 'home';
  new (customConfiguration?: ViewConfig): AbstractView;
}
