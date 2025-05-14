export interface Product {
    id?: string;
    user_id?: string;
    name: string;
    description: string;
    price: number;
    tax_rate: number;
    is_service: boolean;
    category_id: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ProductActionResult {
    success: boolean;
    error?: string;
    data?: Product | Product[] | null;
}
