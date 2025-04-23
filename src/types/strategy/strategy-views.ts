import { LovelaceViewConfig } from '../homeassistant/data/lovelace/config/view';
import { CustomHeaderCardConfig } from './strategy-cards';
import { SupportedDomains } from './strategy-generics';

/**
 * Options for the extended View class.
 *
 * @property {StrategyHeaderCardConfig} [headerCardConfiguration] - Options for the Header card.
 */
export interface ViewConfig extends LovelaceViewConfig {
  headerCardConfiguration?: CustomHeaderCardConfig;
}

/**
 * Interface for constructors of AbstractView subclasses that are expected to define a static domain property.
 *
 * @property {SupportedDomains | "home"} domain - The domain which the view is representing.
 */
export interface ViewConstructor {
  domain: SupportedDomains | 'home';
}
