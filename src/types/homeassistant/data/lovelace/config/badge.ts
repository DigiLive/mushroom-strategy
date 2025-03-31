import {Condition} from "../../../panels/common/validate-condition";

export interface LovelaceBadgeConfig {
  type: string;
  [key: string]: any;
  visibility?: Condition[];
}
