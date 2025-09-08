import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create({ name: createRoleDto.name });
    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      role.permissions = createRoleDto.permissionIds.map(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (id) => ({ id }) as any,
      );
    }

    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ["permissions"] });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ["permissions"],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, { name: updateRoleDto.name ?? role.name });
    if (updateRoleDto.permissionIds) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      role.permissions = updateRoleDto.permissionIds.map(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (id) => ({ id }) as any,
      );
    }
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.roleRepository.remove(role);
  }
}
