export class RouteEntity {
  constructor(
   public id: number,
   public name: string,
   public origin: string,
   public destination: string,
   public distance_km: number,
   public estimated_time: number,
   public status: boolean,
   public updated_at?: Date,
  ) {}
}