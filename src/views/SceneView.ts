import {Helper} from "../Helper";
import {AbstractView} from "./AbstractView";
import {views} from "../types/strategy/views";
import {generic} from "../types/strategy/generic";
import SupportedDomains = generic.SupportedDomains;

// noinspection JSUnusedGlobalSymbols Class is dynamically imported.
/**
 * Scene View Class.
 *
 * Used to create a view for entities of the scene domain.
 *
 * @class SceneView
 * @extends AbstractView
 */
class SceneView extends AbstractView {
  /**
   * Domain of the view's entities.
   *
   * @type {SupportedDomains}
   * @static
   * @private
   */
  static #domain: SupportedDomains = "scene";

  /**
   * Default configuration of the view.
   *
   * @type {views.ViewConfig}
   * @private
   */
  #defaultConfig: views.ViewConfig = {
    title: Helper.customLocalize("scene.scenes"),
    path: "scenes",
    icon: "mdi:palette",
    subview: false,
    controllerCardOptions: {
      showControls: false,
    },
  };

  /**
   * Class constructor.
   *
   * @param {views.ViewConfig} [options={}] Options for the view.
   */
  constructor(options: views.ViewConfig = {}) {
    super(SceneView.#domain);

    this.config = Object.assign(this.config, this.#defaultConfig, options);
  }
}

export {SceneView};
