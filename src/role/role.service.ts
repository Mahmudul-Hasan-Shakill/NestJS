import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { RoleDto } from './dtos/role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  // Get all roles
  async getAllRoles(): Promise<any> {
    try {
      const roles = await this.roleRepository.find({
        order: { roleName: 'ASC' },
      });
      return this.successResponse('Roles retrieved successfully.', roles);
    } catch (error) {
      return this.errorResponse('Failed to retrieve roles.', error);
    }
  }

  // Get distinct role names
  async getRoleNames(): Promise<any> {
    try {
      const roleNames = await this.roleRepository
        .createQueryBuilder('role')
        .select('DISTINCT role.role_name')
        .getRawMany();

      return this.successResponse(
        'Role names retrieved successfully.',
        roleNames.map((role) => role.role_name),
      );
    } catch (error) {
      return this.errorResponse('Failed to retrieve role names.', error);
    }
  }

  // Get distinct GUI names
  async getGuiNames(): Promise<any> {
    try {
      const guiNames = await this.roleRepository
        .createQueryBuilder('role')
        .select('DISTINCT role.href_gui')
        .getRawMany();

      return this.successResponse(
        'GUI names retrieved successfully.',
        guiNames.map((role) => role.href_gui),
      );
    } catch (error) {
      return this.errorResponse('Failed to retrieve GUI names.', error);
    }
  }

  // Get GUI names by role name
  async getGuiByRoleName(roleName: string): Promise<any> {
    try {
      const guiNames = await this.roleRepository
        .createQueryBuilder('role')
        .select(['role.hrefGui', 'role.hrefLabel', 'role.isActive'])
        .where('role.roleName = :roleName', { roleName })
        .getMany();

      return this.successResponse('GUI retrieved successfully.', guiNames);
    } catch (error) {
      return this.errorResponse('Failed to retrieve GUI by role name.', error);
    }
  }

  // Create new roles
  async createRoles(roleDtos: RoleDto[]): Promise<any> {
    try {
      for (const roleDto of roleDtos) {
        const existingRole = await this.roleRepository.findOne({
          where: { roleName: roleDto.roleName, hrefGui: roleDto.hrefGui },
        });

        if (existingRole) {
          throw new ConflictException(
            `The page "${roleDto.hrefGui}" is already assigned to the role "${roleDto.roleName}".`,
          );
        }

        const roleEntity = this.roleRepository.create(roleDto);
        await this.roleRepository.save(roleEntity);
      }

      return this.successResponse('Roles inserted successfully.');
    } catch (error) {
      return this.errorResponse(
        error.message || 'Failed to insert roles.',
        error,
      );
    }
  }

  // Update roles based on roleName and hrefGui
  async updateRole(roleData: UpdateRoleDto): Promise<any> {
    try {
      const { roleName, hrefGui } = roleData;

      // Loop through each hrefGui to update the role and related information
      for (const gui of hrefGui) {
        await this.roleRepository.update(
          { roleName, hrefGui: gui.hrefGui }, // Condition to find the right record
          {
            isActive: gui.isActive,
            editBy: gui.editBy,
            editDate: gui.editDate,
          },
        );
      }

      return this.successResponse('Role updated successfully.');
    } catch (error) {
      // Log the error and return an error response
      console.error('Error updating role:', error);
      return this.errorResponse('Failed to update role.', error);
    }
  }

  // Update a single role by ID
  async updateRoleById(id: number, roleDto: RoleDto): Promise<any> {
    try {
      const result = await this.roleRepository.update({ id }, roleDto); // Use RoleDto for updates
      if (result.affected > 0) {
        return this.successResponse('Role updated successfully.');
      } else {
        throw new NotFoundException('Role not found for update.');
      }
    } catch (error) {
      return this.errorResponse('Failed to update role information.', error);
    }
  }

  // Delete a role by ID
  async deleteRoleById(id: number): Promise<any> {
    try {
      const result = await this.roleRepository.delete(id);
      if (result.affected > 0) {
        return this.successResponse('Role deleted successfully.');
      } else {
        throw new NotFoundException('Role not found for deletion.');
      }
    } catch (error) {
      return this.errorResponse('Failed to delete role.', error);
    }
  }

  // Utility method for success response
  private successResponse(message: string, data: any = null) {
    return {
      isSuccessful: true,
      message,
      data,
    };
  }

  // Utility method for error response
  private errorResponse(message: string, error?: any) {
    console.error(error); // Log the error for debugging
    return {
      isSuccessful: false,
      message,
      data: null,
    };
  }
}
