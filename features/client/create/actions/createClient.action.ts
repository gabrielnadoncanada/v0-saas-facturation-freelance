'use server';
import { revalidatePath } from 'next/cache';
import { ClientFormSchema } from '@/features/client/shared/schema/client.schema';
import { ClientQueries } from '@/shared/lib/drizzle/queries/ClientQueries';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { CLIENTS_PATH } from '@/shared/lib/routes';

export async function createClientAction(formData: ClientFormSchema): Promise<Result<null>> {
  return withAction(async () => {
    const clientData = { ...formData };
    delete (clientData as any).sameAsShipping;

    if (formData.sameAsShipping) {
      clientData.shippingAddress = formData.billingAddress;
      clientData.shippingCity = formData.billingCity;
      clientData.shippingPostalCode = formData.billingPostalCode;
      clientData.shippingCountry = formData.billingCountry;
    }

    await ClientQueries.create(clientData);
    revalidatePath(CLIENTS_PATH);
    return null;
  });
}
