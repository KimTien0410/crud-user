import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../role/entities/role.entity";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // create_user, delete_user, update_article

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
