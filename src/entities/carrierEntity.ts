export class CarrierEntity {
  constructor(
   public id: number,
   public user_id: number,
   public availability : boolean,
   public created_at: Date,
   public updated_at?: Date,
  ) {}
}