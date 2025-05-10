import { LovelaceViewConfig } from '../homeassistant/data/lovelace/config/view';
import { SupportedDomains } from './strategy-generics';
import { HeaderCardConfig } from './strategy-cards';

/**
 * Options for the extended View class.
 *
 * @property {HeaderCardConfig} [headerCardConfiguration] - Options for the Header card.
 */
export interface ViewConfig extends LovelaceViewConfig {
  headerCardConfiguration?: HeaderCardConfig;
}

/**
 * Interface for constructors of AbstractView subclasses that are expected to define a static domain property.
 *
 * @property {SupportedDomains | 'home'} domain - The domain which the view is representing.
 */
export interface ViewConstructor {
  domain: SupportedDomains | 'home';
}
