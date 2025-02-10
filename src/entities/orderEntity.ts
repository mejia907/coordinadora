export class OrderEntity {
  constructor(
    public id: number,
    public user_id: number,
    public guide_order: string,
    public type_product: string,
    public weight: number,
    public dimension_long: number,
    public dimension_tall: number,
    public dimension_width: number,
    public amount: number,
    public destination_address: string,
    public contact_receive: string,
    public contact_phone: string,
    public description_content: string,
    public declared_value: number,
    public notes_delivery: string,
    public created_at: Date,
    public status_order_id: number, 
    public estimated_delivery?: Date,
    public carrier_id?: number,
    public route_id?: number,
    public actual_delivery?: Date,
    public updated_at?: Date
  ) { }
}