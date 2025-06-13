'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { ActionResult } from '@/shared/types/api.types';
import { Organization } from '@/shared/types/organization.types';
import { revalidatePath } from 'next/cache';

interface CreateOrganizationData {
  name: string;
  slug: string;
}

export async function createOrganizationAction(
  data: CreateOrganizationData,
): Promise<ActionResult<Organization>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Non authentifié' };
    }

    // Using admin client to bypass RLS policies which might cause recursion
    const adminClient = await createAdminClient();

    // Check if organization with slug already exists
    const { data: existingOrg } = await adminClient
      .from('organizations')
      .select('id')
      .eq('slug', data.slug)
      .single();

    if (existingOrg) {
      return { success: false, error: 'Une organisation avec ce nom court existe déjà' };
    }

    // Create the organization
    const { data: organization, error } = await adminClient
      .from('organizations')
      .insert({
        name: data.name,
        slug: data.slug,
        owner_id: user.id,
        plan: 'free',
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating organization:', error);
      return { success: false, error: "Erreur lors de la création de l'organisation" };
    }

    // Add the creator as an owner (using admin client to bypass RLS)
    const { error: memberError } = await adminClient.from('organization_members').insert({
      organization_id: organization.id,
      user_id: user.id,
      role: 'owner',
    });

    if (memberError) {
      console.error('Error adding member:', memberError);
      return { success: false, error: "Erreur lors de l'ajout du membre" };
    }

    // Set the created organization as active
    const cookieStore = await import('next/headers').then((mod) => mod.cookies());
    cookieStore.set('active_organization_id', organization.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    revalidatePath('/dashboard');

    return { success: true, data: organization };
  } catch (error) {
    console.error('Error in createOrganizationAction:', error);
    return { success: false, error: 'Une erreur est survenue' };
  }
}
