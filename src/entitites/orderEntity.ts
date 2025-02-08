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
    public destination_address: string,
    public created_at: Date,
    public status_order_id: number, 
    public estimated_delivery?: Date,
    public carrier_id?: number,
    public route_id?: number,
    public actual_delivery?: Date,
    public updated_at?: Date
  ) { }
}