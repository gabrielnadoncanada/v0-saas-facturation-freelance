import { getSessionUser } from '@/shared/utils/getSessionUser';

export async function deleteLogo(): Promise<void> {
  const { supabase, user } = await getSessionUser();

  // Récupérer l'URL actuelle du logo
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('logo_url')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.logo_url) {
    throw new Error('Logo introuvable ou déjà supprimé.');
  }

  // Extraire le nom du fichier depuis l'URL publique
  const path = new URL(profile.logo_url).pathname.split('/').slice(3).join('/');

  const { error: deleteError } = await supabase.storage.from('logos').remove([path]);

  if (deleteError) {
    throw new Error('Erreur lors de la suppression du fichier.');
  }

  // Nettoyer le champ dans la table `profiles`
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ logo_url: null })
    .eq('id', user.id);

  if (updateError) {
    throw new Error('Logo supprimé du storage, mais échec de mise à jour du profil.');
  }
}
