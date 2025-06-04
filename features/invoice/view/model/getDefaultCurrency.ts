import { getSessionUser } from '@/shared/utils/getSessionUser';

export async function getDefaultCurrency(): Promise<string> {
  const { supabase, user, organization } = await getSessionUser();

  if (organization) {
    // First try to get organization's default currency from settings if available
    const { data: orgSettings, error: orgError } = await supabase
      .from('organization_settings')
      .select('default_currency')
      .eq('organization_id', organization.id)
      .maybeSingle();

    if (!orgError && orgSettings?.default_currency) {
      return orgSettings.default_currency;
    }
  }

  // Fall back to user's default currency
  const { data, error } = await supabase
    .from('profiles')
    .select('default_currency')
    .eq('id', user.id)
    .single();

  if (error) throw new Error(error.message);
  return data?.default_currency || 'EUR';
}
