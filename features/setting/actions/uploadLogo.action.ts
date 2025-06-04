'use server';

import { uploadLogo } from '@/features/setting/model/uploadLogo';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { revalidatePath } from 'next/cache';
import { PROFILE_PATH } from '@/shared/lib/routes';

export async function uploadLogoAction(formData: FormData): Promise<Result<string>> {
  return withAction(async () => {
    const logoFile = formData.get('logo') as File;
    const publicUrl = await uploadLogo(logoFile);
    revalidatePath(PROFILE_PATH);
    return publicUrl;
  });
}
