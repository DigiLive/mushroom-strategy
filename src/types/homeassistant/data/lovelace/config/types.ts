import {LovelaceViewRawConfig} from "./view";

export interface LovelaceDashboardBaseConfig {}

export interface LovelaceConfig extends LovelaceDashboardBaseConfig {
  background?: string;
  views: LovelaceViewRawConfig[];
}


