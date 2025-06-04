'use client';

import { useState, useEffect } from 'react';
import { PopoverContent, PopoverTrigger, Popover } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus } from 'lucide-react';
import { createClient } from '@/shared/lib/supabase/client';
import { cn } from '@/shared/lib/utils';
import { Check } from 'lucide-react';
import { ProductForm } from '@/features/product/shared/ui/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductSelectorProps {
  onSelect: (product: any) => void;
  buttonClassName?: string;
}

export function ProductSelector({ onSelect, buttonClassName }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const supabase = createClient();

  // Fetch products when popover opens and no products are loaded yet
  useEffect(() => {
    if (open && products.length === 0) {
      fetchProducts();
    }
  }, [open, products.length]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Get active organization from cookie
      const cookieStr = document.cookie;
      const cookies = cookieStr.split('; ');
      const orgCookie = cookies.find((c) => c.startsWith('active_organization_id='));
      const orgId = orgCookie ? orgCookie.split('=')[1] : null;

      if (!orgId) {
        console.error('No active organization');
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', orgId)
        .order('name', { ascending: true });

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductCreated = () => {
    fetchProducts();
    setDialogOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('justify-between w-[250px]', buttonClassName)}>
            Sélectionnez un produit
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[250px]" align="start">
          <ScrollArea className="h-80">
            <div className="py-2">
              {loading ? (
                <div className="px-3 py-2 text-sm">Chargement...</div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-accent flex items-center justify-between"
                    onClick={() => {
                      onSelect(product);
                      setOpen(false);
                    }}
                  >
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {product.price.toFixed(2)} €
                      </div>
                    </div>
                    <div>
                      <Check className="h-4 w-4 opacity-0" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">Aucun produit trouvé</div>
              )}
            </div>
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setDialogOpen(true);
                  setOpen(false);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un produit
              </Button>
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau produit</DialogTitle>
          </DialogHeader>
          <ProductForm product={null} />
        </DialogContent>
      </Dialog>
    </>
  );
}
