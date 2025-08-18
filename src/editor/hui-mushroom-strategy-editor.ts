import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent } from '../utilities/fire-event';
import { StrategyConfig } from '../types/strategy/strategy-generics';

export interface LovelaceStrategyEditor extends HTMLElement {
  hass?: any;
  config?: any;
  setConfig(config: any): void;
  configChanged?: (config: any) => void;
}

@customElement("hui-mushroom-strategy-editor")
export class HuiMushroomStrategyEditor
  extends LitElement
  implements LovelaceStrategyEditor
{
  @property({ attribute: false }) public hass!: any;
  @state() private _config?: any;
  @state() private _selectedConfigArea?: string;

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .section {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }
      
      .section-header {
        font-weight: bold;
        margin-bottom: 12px;
        color: var(--primary-text-color);
      }
      
      .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .form-row label {
        width: 200px;
        color: var(--primary-text-color);
      }
      
      ha-switch {
        margin-left: auto;
      }
      
      ha-textfield {
        flex: 1;
        margin-left: 16px;
      }
      
      ha-select {
        flex: 1;
        margin-left: 16px;
      }
    `;
  }

  public setConfig(config: any): void {
    this._config = config || { type: 'custom:mushroom-strategy', options: {} };
  }

  public configChanged(config: any): void {
    this._config = config || { type: 'custom:mushroom-strategy', options: {} };
    this.requestUpdate();
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config) return;

    const target = ev.target as any;
    const configPath = target.configPath;
    const value = target.value;

    if (!configPath) return;

    const newConfig = JSON.parse(JSON.stringify(this._config));
    
    // Ensure the options structure exists (flat structure for strategies)
    if (!newConfig.options) {
      newConfig.options = {};
    }
    
    // Navigate to the correct path and set the value
    let current = newConfig.options;
    const pathParts = configPath.split('.');
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = value;

    fireEvent(this, "config-changed", { config: newConfig });
  }

  protected render(): TemplateResult {
    if (!this._config) {
      // Initialize with default config if none provided
      this._config = { 
        type: 'custom:mushroom-strategy', 
        options: {} 
      };
    }

    // For strategies, options are directly under the config
    const options = this._config.options || {};

    console.log('Editor rendering with config:', this._config);

    return html`
      <div class="card-config">
        <div style="margin-bottom: 16px; padding: 8px; background: var(--secondary-background-color); border-radius: 4px;">
          <strong>Mushroom Strategy Configuration</strong>
        </div>
        ${this._renderGeneralSection(options)}
        ${this._renderHomeViewSection(options)}
        ${this._renderChipsSection(options)}
        ${this._renderAreasSection(options)}
        ${this._renderDomainsSection(options)}
        ${this._renderDomainStackCountsSection(options)}
        ${this._renderDomainOrderSection(options)}
        ${this._renderViewsSection(options)}
        ${this._renderViewOrderSection(options)}
        ${this._renderExtraCardsSection(options)}
        ${this._renderQuickAccessCardsSection(options)}
        ${this._renderExtraViewsSection(options)}
      </div>
    `;
  }

  private _renderGeneralSection(options: StrategyConfig): TemplateResult {
    const domains = options.domains || {};
    const allDomainsConfig = domains._ || {};
    
    return html`
      <div class="section">
        <div class="section-header">General Settings</div>
        
        <div class="form-row">
          <label>Debug Mode</label>
          <ha-switch
            .checked=${options.debug || false}
            .configPath=${"debug"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div class="form-row">
          <label>Hide Config Entities</label>
          <ha-switch
            .checked=${allDomainsConfig.hide_config_entities || false}
            .configPath=${"domains._.hide_config_entities"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div class="form-row">
          <label>Hide Diagnostic Entities</label>
          <ha-switch
            .checked=${allDomainsConfig.hide_diagnostic_entities || false}
            .configPath=${"domains._.hide_diagnostic_entities"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div class="form-row">
          <label>Show Controls</label>
          <ha-switch
            .checked=${allDomainsConfig.showControls !== false}
            .configPath=${"domains._.showControls"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div class="form-row">
          <label>Default Stack Count</label>
          <ha-textfield
            type="number"
            .value=${allDomainsConfig.stack_count || 1}
            .configPath=${"domains._.stack_count"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
      </div>
    `;
  }

  private _renderHomeViewSection(options: StrategyConfig): TemplateResult {
    const homeView = options.home_view || { hidden: [], stack_count: { _: 2 } };
    
    return html`
      <div class="section">
        <div class="section-header">Home View Settings</div>
        
        <div class="form-row">
          <label>Default Stack Count</label>
          <ha-textfield
            type="number"
            .value=${homeView.stack_count?._ || 2}
            .configPath=${"home_view.stack_count._"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        
        <div class="form-row">
          <label>Area Stack Count</label>
          <ha-textfield
            type="number"
            .value=${homeView.stack_count?.areas || 2}
            .configPath=${"home_view.stack_count.areas"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        
        <div class="form-row">
          <label>Person Stack Count</label>
          <ha-textfield
            type="number"
            .value=${homeView.stack_count?.persons || 2}
            .configPath=${"home_view.stack_count.persons"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        
        ${this._renderHiddenSections(homeView.hidden || [])}
      </div>
    `;
  }

  private _renderHiddenSections(hidden: string[]): TemplateResult {
    const sections = ['areas', 'areasTitle', 'chips', 'greeting', 'persons'];
    
    return html`
      <div>
        <label>Hidden Sections:</label>
        ${sections.map(section => html`
          <div class="form-row">
            <label>${section}</label>
            <ha-switch
              .checked=${hidden.includes(section)}
              .configPath=${"home_view.hidden"}
              .section=${section}
              @change=${this._toggleHiddenSection}
            ></ha-switch>
          </div>
        `)}
      </div>
    `;
  }

  private _toggleHiddenSection(ev: CustomEvent): void {
    const target = ev.target as any;
    const section = target.section;
    const isChecked = target.checked;
    
    if (!this._config) return;
    
    const newConfig = JSON.parse(JSON.stringify(this._config));
    
    // Ensure the options structure exists (flat structure for strategies)
    if (!newConfig.options) {
      newConfig.options = {};
    }
    
    const hidden = newConfig.options.home_view?.hidden || [];
    
    if (isChecked && !hidden.includes(section)) {
      hidden.push(section);
    } else if (!isChecked) {
      const index = hidden.indexOf(section);
      if (index > -1) {
        hidden.splice(index, 1);
      }
    }
    
    if (!newConfig.options.home_view) {
      newConfig.options.home_view = {};
    }
    newConfig.options.home_view.hidden = hidden;

    fireEvent(this, "config-changed", { config: newConfig });
  }

  private _renderChipsSection(options: StrategyConfig): TemplateResult {
    const chips = options.chips || {};
    
    return html`
      <div class="section">
        <div class="section-header">Chips Configuration</div>
        
        <div class="form-row">
          <label>Weather Entity</label>
          <ha-textfield
            .value=${chips.weather_entity || 'auto'}
            .configPath=${"chips.weather_entity"}
            @input=${this._valueChanged}
            placeholder="auto or weather.entity_id"
          ></ha-textfield>
        </div>
        
        <div class="form-row">
          <label>Light Count</label>
          <ha-switch
            .checked=${chips.light_count !== false}
            .configPath=${"chips.light_count"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div class="form-row">
          <label>Fan Count</label>
          <ha-switch
            .checked=${chips.fan_count !== false}
            .configPath=${"chips.fan_count"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div class="form-row">
          <label>Cover Count</label>
          <ha-switch
            .checked=${chips.cover_count !== false}
            .configPath=${"chips.cover_count"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div class="form-row">
          <label>Switch Count</label>
          <ha-switch
            .checked=${chips.switch_count !== false}
            .configPath=${"chips.switch_count"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div class="form-row">
          <label>Climate Count</label>
          <ha-switch
            .checked=${chips.climate_count !== false}
            .configPath=${"chips.climate_count"}
            @change=${this._valueChanged}
          ></ha-switch>
        </div>
        
        <div style="margin-top: 12px;">
          <label><strong>Extra Chips:</strong></label>
          <div style="margin-top: 8px; padding: 8px; background: var(--card-background-color); border-radius: 4px; font-size: 12px;">
            Configure additional chips in YAML mode. Use the "extra_chips" property.
          </div>
        </div>
      </div>
    `;
  }

  private _renderAreasSection(options: StrategyConfig): TemplateResult {
    return html`
      <div class="section">
        <div class="section-header">Areas Configuration</div>
        
        <div class="form-row">
          <label>Default Area Card Type</label>
          <ha-select
            .value=${options.areas?._ || 'AreaCard'}
            .configPath=${"areas._.type"}
            @selected=${this._valueChanged}
          >
            <mwc-list-item value="AreaCard">Mushroom Area Card</mwc-list-item>
            <mwc-list-item value="HaAreaCard">Home Assistant Area Card</mwc-list-item>
          </ha-select>
        </div>
      </div>
    `;
  }

  private _renderDomainsSection(options: StrategyConfig): TemplateResult {
    const domains = options.domains || {};
    const supportedDomains = ['light', 'switch', 'fan', 'cover', 'climate', 'lock', 'camera', 'vacuum', 'scene'] as const;
    
    return html`
      <div class="section">
        <div class="section-header">Domain Configuration</div>
        
        ${supportedDomains.map(domain => html`
          <div class="form-row">
            <label>${domain.charAt(0).toUpperCase() + domain.slice(1)}</label>
            <ha-switch
              .checked=${!domains[domain]?.hidden}
              .configPath=${"domains." + domain + ".hidden"}
              @change=${this._toggleDomainHidden}
            ></ha-switch>
          </div>
        `)}
      </div>
    `;
  }

  private _toggleDomainHidden(ev: CustomEvent): void {
    const target = ev.target as any;
    const configPath = target.configPath;
    const isChecked = target.checked;
    
    if (!this._config) return;
    
    const newConfig = JSON.parse(JSON.stringify(this._config));
    
    // Ensure the options structure exists (flat structure for strategies)
    if (!newConfig.options) {
      newConfig.options = {};
    }
    
    // Navigate to the correct path and set the hidden value (opposite of checked)
    let current = newConfig.options;
    const pathParts = configPath.split('.');
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = !isChecked;

    fireEvent(this, "config-changed", { config: newConfig });
  }

  private _renderViewsSection(options: StrategyConfig): TemplateResult {
    const views = options.views || {};
    const supportedViews = ['home', 'light', 'switch', 'fan', 'cover', 'climate', 'lock', 'camera', 'vacuum', 'scene'] as const;
    
    return html`
      <div class="section">
        <div class="section-header">Views Configuration</div>
        
        ${supportedViews.map(view => html`
          <div class="form-row">
            <label>${view.charAt(0).toUpperCase() + view.slice(1)} View</label>
            <ha-switch
              .checked=${!views[view]?.hidden}
              .configPath=${"views." + view + ".hidden"}
              @change=${this._toggleViewHidden}
            ></ha-switch>
          </div>
        `)}
      </div>
    `;
  }

  private _toggleViewHidden(ev: CustomEvent): void {
    const target = ev.target as any;
    const configPath = target.configPath;
    const isChecked = target.checked;
    
    if (!this._config) return;
    
    const newConfig = JSON.parse(JSON.stringify(this._config));
    
    // Ensure the options structure exists (flat structure for strategies)
    if (!newConfig.options) {
      newConfig.options = {};
    }
    
    // Navigate to the correct path and set the hidden value (opposite of checked)
    let current = newConfig.options;
    const pathParts = configPath.split('.');
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = !isChecked;

    fireEvent(this, "config-changed", { config: newConfig });
  }

  private _renderDomainStackCountsSection(options: StrategyConfig): TemplateResult {
    const domains = options.domains || {} as any;
    const supportedDomains = ['binary_sensor', 'camera', 'climate', 'cover', 'fan', 'input_select', 'light', 'lock', 'media_player', 'number', 'scene', 'select', 'sensor', 'switch', 'vacuum', 'valve'] as const;
    
    return html`
      <div class="section">
        <div class="section-header">Domain Stack Counts</div>
        
        ${supportedDomains.map(domain => html`
          <div class="form-row">
            <label>${domain.charAt(0).toUpperCase() + domain.slice(1).replace('_', ' ')} Stack Count</label>
            <ha-textfield
              type="number"
              .value=${domains[domain]?.stack_count || 1}
              .configPath=${"domains." + domain + ".stack_count"}
              @input=${this._valueChanged}
            ></ha-textfield>
          </div>
        `)}
      </div>
    `;
  }

  private _renderDomainOrderSection(options: StrategyConfig): TemplateResult {
    const domains = options.domains || {} as any;
    const supportedDomains = ['binary_sensor', 'camera', 'climate', 'cover', 'fan', 'input_select', 'light', 'lock', 'media_player', 'number', 'scene', 'select', 'sensor', 'switch', 'vacuum', 'valve'] as const;
    
    return html`
      <div class="section">
        <div class="section-header">Domain Order</div>
        
        ${supportedDomains.map(domain => html`
          <div class="form-row">
            <label>${domain.charAt(0).toUpperCase() + domain.slice(1).replace('_', ' ')} Order</label>
            <ha-textfield
              type="number"
              .value=${domains[domain]?.order || 0}
              .configPath=${"domains." + domain + ".order"}
              @input=${this._valueChanged}
            ></ha-textfield>
          </div>
        `)}
      </div>
    `;
  }

  private _renderViewOrderSection(options: StrategyConfig): TemplateResult {
    const views = options.views || {} as any;
    const supportedViews = ['home', 'light', 'switch', 'fan', 'cover', 'climate', 'lock', 'camera', 'vacuum', 'scene', 'valve'] as const;
    
    return html`
      <div class="section">
        <div class="section-header">View Order</div>
        
        ${supportedViews.map(view => html`
          <div class="form-row">
            <label>${view.charAt(0).toUpperCase() + view.slice(1)} View Order</label>
            <ha-textfield
              type="number"
              .value=${views[view]?.order || 0}
              .configPath=${"views." + view + ".order"}
              @input=${this._valueChanged}
            ></ha-textfield>
          </div>
        `)}
      </div>
    `;
  }

  private _renderExtraCardsSection(options: StrategyConfig): TemplateResult {
    return html`
      <div class="section">
        <div class="section-header">Extra Cards</div>
        
        <div style="padding: 8px; background: var(--card-background-color); border-radius: 4px; font-size: 12px;">
          Extra cards are shown below room cards on each view. Configure them in YAML mode using the "extra_cards" property.
          <br><br>
          Example:
          <pre style="margin: 8px 0; padding: 4px; background: var(--secondary-background-color); border-radius: 4px;">extra_cards:
  - type: entities
    entities:
      - entity: sensor.example</pre>
        </div>
      </div>
    `;
  }

  private _renderQuickAccessCardsSection(options: StrategyConfig): TemplateResult {
    return html`
      <div class="section">
        <div class="section-header">Quick Access Cards</div>
        
        <div style="padding: 8px; background: var(--card-background-color); border-radius: 4px; font-size: 12px;">
          Quick access cards are shown between the welcome card and room cards in the home view. Configure them in YAML mode using the "quick_access_cards" property.
          <br><br>
          Example:
          <pre style="margin: 8px 0; padding: 4px; background: var(--secondary-background-color); border-radius: 4px;">quick_access_cards:
  - type: button
    entity: script.example</pre>
        </div>
      </div>
    `;
  }

  private _renderExtraViewsSection(options: StrategyConfig): TemplateResult {
    return html`
      <div class="section">
        <div class="section-header">Extra Views</div>
        
        <div style="padding: 8px; background: var(--card-background-color); border-radius: 4px; font-size: 12px;">
          Extra views are custom-defined views added to the dashboard. Configure them in YAML mode using the "extra_views" property.
          <br><br>
          Example:
          <pre style="margin: 8px 0; padding: 4px; background: var(--secondary-background-color); border-radius: 4px;">extra_views:
  - title: My Custom View
    path: custom
    cards:
      - type: entities
        entities:
          - entity: sensor.example</pre>
        </div>
      </div>
    `;
  }
}

// Ensure custom element is registered
if (!customElements.get("hui-mushroom-strategy-editor")) {
}