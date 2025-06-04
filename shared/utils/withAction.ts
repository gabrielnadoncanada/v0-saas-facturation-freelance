import { revalidatePath as revalidate } from 'next/cache';
import { redirect as nextRedirect } from 'next/navigation';
import { Result, success, fail } from '@/shared/utils/result';

interface ActionOptions {
  revalidatePath?: string | string[];
  redirect?: string;
}

export async function withAction<T>(
  callback: () => Promise<T>,
  options: ActionOptions = {},
): Promise<Result<T>> {
  try {
    const data = await callback();
    if (options.revalidatePath) {
      const paths = Array.isArray(options.revalidatePath)
        ? options.revalidatePath
        : [options.revalidatePath];
      for (const path of paths) {
        revalidate(path);
      }
    }
    if (options.redirect) {
      nextRedirect(options.redirect);
    }
    return success(data);
  } catch (error) {
    return fail((error as Error).message);
  }
}
