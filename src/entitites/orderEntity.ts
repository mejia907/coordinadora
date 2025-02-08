export class OrderEntity {
  constructor(
    public id: number,
    public user_id: number,
    public type_product: string,
    public weight: number,
    public dimension_long: number,
    public dimension_tall: number,
    public dimension_width: number,
    public amount: number,
    public destination_city: string,
    public destination_address: string,
    public carrier_id: number,
    public estimated_delivery: Date,
    public created_at: Date,
    public status_order_id: number = 1, // "En espera" por defecto
    public actual_delivery?: Date,
    public updated_at?: Date
  ) { }
}