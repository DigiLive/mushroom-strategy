export interface ConfigEntry {
  entry_id: string;
  domain: string;
  title: string;
  source: string;
  state:
    | 'loaded'
    | 'setup_error'
    | 'migration_error'
    | 'setup_retry'
    | 'not_loaded'
    | 'failed_unload'
    | 'setup_in_progress';
  supports_options: boolean;
  supports_remove_device: boolean;
  supports_unload: boolean;
  supports_reconfigure: boolean;
  supported_subentry_types: Record<string, { supports_reconfigure: boolean }>;
  num_subentries: number;
  pref_disable_new_entities: boolean;
  pref_disable_polling: boolean;
  disabled_by: 'user' | null;
  reason: string | null;
  error_reason_translation_key: string | null;
  error_reason_translation_placeholders: Record<string, string> | null;
}
