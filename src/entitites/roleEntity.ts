export class RoleEntity {
  constructor(
   public id: number,
   public name: string,
   public status: boolean,
   public created_at: Date,
   public description?: string,
   public updated_at?: Date,
  ) {}
}