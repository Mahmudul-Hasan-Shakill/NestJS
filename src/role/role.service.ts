// import {
//   ConflictException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { RoleEntity } from './entity/role.entity';
// import { RoleDto } from './dtos/role.dto';
// import { UpdateRoleDto } from './dtos/update-role.dto';

// @Injectable()
// export class RoleService {
//   constructor(
//     @InjectRepository(RoleEntity)
//     private roleRepository: Repository<RoleEntity>,
//   ) {}

//   // Get all roles
//   async getAllRoles(): Promise<any> {
//     try {
//       const roles = await this.roleRepository.find({
//         order: { roleName: 'ASC' },
//       });
//       return this.successResponse('Roles retrieved successfully.', roles);
//     } catch (error) {
//       return this.errorResponse('Failed to retrieve roles.', error);
//     }
//   }

//   // Get distinct role names
//   async getRoleNames(): Promise<any> {
//     try {
//       const roleNames = await this.roleRepository
//         .createQueryBuilder('role')
//         .select('DISTINCT role.role_name')
//         .orderBy('role.role_name', 'ASC')
//         .getRawMany();

//       return this.successResponse(
//         'Role names retrieved successfully.',
//         roleNames.map((role) => role.role_name),
//       );
//     } catch (error) {
//       return this.errorResponse('Failed to retrieve role names.', error);
//     }
//   }

//   // Get distinct GUI names
//   async getGuiNames(): Promise<any> {
//     try {
//       const guiNames = await this.roleRepository
//         .createQueryBuilder('role')
//         .select('DISTINCT role.href_gui')
//         .orderBy('role.href_gui', 'ASC')
//         .getRawMany();

//       return this.successResponse(
//         'GUI names retrieved successfully.',
//         guiNames.map((role) => role.href_gui),
//       );
//     } catch (error) {
//       return this.errorResponse('Failed to retrieve GUI names.', error);
//     }
//   }

//   // Get GUI names by role name
//   async getGuiByRoleName(roleName: string): Promise<any> {
//     try {
//       const guiNames = await this.roleRepository
//         .createQueryBuilder('role')
//         // .select(['role.hrefGui', 'role.hrefLabel', 'role.isActive'])
//         .select(['role.hrefGui', 'role.isActive'])
//         .where('role.roleName = :roleName', { roleName })
//         .getMany();

//       return this.successResponse('GUI retrieved successfully.', guiNames);
//     } catch (error) {
//       return this.errorResponse('Failed to retrieve GUI by role name.', error);
//     }
//   }

//   // Create new roles
//   async createRoles(roleDtos: RoleDto[]): Promise<any> {
//     try {
//       for (const roleDto of roleDtos) {
//         const existingRole = await this.roleRepository.findOne({
//           where: { roleName: roleDto.roleName, hrefGui: roleDto.hrefGui },
//         });

//         if (existingRole) {
//           throw new ConflictException(
//             `The page "${roleDto.hrefGui}" is already assigned to the role "${roleDto.roleName}".`,
//           );
//         }

//         const roleEntity = this.roleRepository.create(roleDto);
//         await this.roleRepository.save(roleEntity);
//       }

//       return this.successResponse('Roles inserted successfully.');
//     } catch (error) {
//       return this.errorResponse(
//         error.message || 'Failed to insert roles.',
//         error,
//       );
//     }
//   }

//   // Update roles based on roleName and hrefGui
//   async updateRole(roleData: UpdateRoleDto): Promise<any> {
//     try {
//       const { roleName, hrefGui } = roleData;

//       // Loop through each hrefGui to update the role and related information
//       for (const gui of hrefGui) {
//         await this.roleRepository.update(
//           { roleName, hrefGui: gui.hrefGui }, // Condition to find the right record
//           {
//             isActive: gui.isActive,
//             editBy: gui.editBy,
//             editDate: gui.editDate,
//           },
//         );
//       }

//       return this.successResponse('Role updated successfully.');
//     } catch (error) {
//       // Log the error and return an error response
//       console.error('Error updating role:', error);
//       return this.errorResponse('Failed to update role.', error);
//     }
//   }

//   // Update a single role by ID
//   async updateRoleById(id: number, roleDto: RoleDto): Promise<any> {
//     try {
//       const result = await this.roleRepository.update({ id }, roleDto); // Use RoleDto for updates
//       if (result.affected > 0) {
//         return this.successResponse('Role updated successfully.');
//       } else {
//         throw new NotFoundException('Role not found for update.');
//       }
//     } catch (error) {
//       return this.errorResponse('Failed to update role information.', error);
//     }
//   }

//   // Delete a role by ID
//   async deleteRoleById(id: number): Promise<any> {
//     try {
//       const result = await this.roleRepository.delete(id);
//       if (result.affected > 0) {
//         return this.successResponse('Role deleted successfully.');
//       } else {
//         throw new NotFoundException('Role not found for deletion.');
//       }
//     } catch (error) {
//       return this.errorResponse('Failed to delete role.', error);
//     }
//   }

//   // Delete roles by role name
//   async deleteRoleByName(roleName: string): Promise<any> {
//     try {
//       const rolesToDelete = await this.roleRepository.find({
//         where: { roleName },
//       });

//       if (rolesToDelete.length === 0) {
//         throw new NotFoundException(
//           `No roles found with roleName "${roleName}".`,
//         );
//       }

//       await this.roleRepository.delete({ roleName });

//       return this.successResponse(
//         `All roles with Rolename "${roleName}" deleted successfully.`,
//       );
//     } catch (error) {
//       return this.errorResponse(
//         `Failed to delete roles with roleName "${roleName}".`,
//         error,
//       );
//     }
//   }

//   // Utility method for success response
//   private successResponse(message: string, data: any = null) {
//     return {
//       isSuccessful: true,
//       message,
//       data,
//     };
//   }

//   // Utility method for error response
//   private errorResponse(message: string, error?: any) {
//     console.error(error); // Log the error for debugging
//     return {
//       isSuccessful: false,
//       message,
//       data: null,
//     };
//   }
// }

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entity/role.entity';
import { RoleDto } from './dtos/role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { PermissionActions } from 'src/common/enums/permissions.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

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

  // async getRoleNames(): Promise<any> {
  //   try {
  //     const roleNames = await this.roleRepository
  //       .createQueryBuilder('role')
  //       .select('DISTINCT role.role_name')
  //       .orderBy('role.role_name', 'ASC')
  //       .getRawMany();
  //     return this.successResponse(
  //       'Role names retrieved successfully.',
  //       roleNames.map((role) => role.role_name),
  //     );
  //   } catch (error) {
  //     return this.errorResponse('Failed to retrieve role names.', error);
  //   }
  // }

  // src/role/role.service.ts
  async getRoleNames(actor?: { role?: string }): Promise<any> {
    try {
      const isRoot = (actor?.role ?? '').trim().toLowerCase() === 'root';

      const qb = this.roleRepository
        .createQueryBuilder('role')
        .select('DISTINCT role.role_name', 'role_name')
        .orderBy('role.role_name', 'ASC');

      // Non-root callers must NOT see "root" in the list
      if (!isRoot) {
        qb.where('LOWER(role.role_name) <> :root', { root: 'root' });
      }

      const rows = await qb.getRawMany();
      return this.successResponse(
        'Role names retrieved successfully.',
        rows.map((r) => r.role_name),
      );
    } catch (error) {
      return this.errorResponse('Failed to retrieve role names.', error);
    }
  }

  async getGuiNames(): Promise<any> {
    try {
      const guiNames = await this.roleRepository
        .createQueryBuilder('role')
        .select('DISTINCT role.href_gui')
        .orderBy('role.href_gui', 'ASC')
        .getRawMany();
      return this.successResponse(
        'GUI names retrieved successfully.',
        guiNames.map((role) => role.href_gui),
      );
    } catch (error) {
      return this.errorResponse('Failed to retrieve GUI names.', error);
    }
  }

  async getGuiByRoleName(roleName: string): Promise<any> {
    try {
      const guiDataWithPermissions = await this.roleRepository
        .createQueryBuilder('role')
        .select(['role.hrefGui', 'role.isActive', 'role.permissions']) // Include permissions
        .where('role.roleName = :roleName', { roleName })
        .getMany();
      return this.successResponse(
        'GUI retrieved successfully.',
        guiDataWithPermissions,
      );
    } catch (error) {
      return this.errorResponse('Failed to retrieve GUI by role name.', error);
    }
  }

  async createRoles(roleDtos: RoleDto[]): Promise<any> {
    try {
      const savedRoles = [];
      for (const roleDto of roleDtos) {
        // Check for existing (roleName + hrefGui)
        const exists = await this.roleRepository.findOne({
          where: { roleName: roleDto.roleName, hrefGui: roleDto.hrefGui },
        });
        if (exists) {
          throw new ConflictException(`Already exists.`);
        }
        // Save
        const saved = await this.roleRepository.save(
          this.roleRepository.create(roleDto),
        );
        savedRoles.push(saved);
      }
      return this.successResponse('Roles inserted successfully.', savedRoles);
    } catch (error) {
      return this.errorResponse(
        error.message || 'Failed to insert roles.',
        error,
      );
    }
  }

  async updateRole(roleData: UpdateRoleDto): Promise<any> {
    const { roleName, guiPermissions } = roleData;

    for (const guiPerm of guiPermissions) {
      const row = await this.roleRepository.findOne({
        where: { roleName, hrefGui: guiPerm.hrefGui },
      });
      if (!row) continue;
      await this.roleRepository.update(
        { id: row.id },
        {
          isActive: guiPerm.isActive,
          editBy: guiPerm.editBy,
          editDate: guiPerm.editDate,
          permissions: guiPerm.permissions,
        },
      );
    }
    return this.successResponse('Role updated successfully.');
  }

  async updateRoleById(id: number, roleDto: RoleDto): Promise<any> {
    try {
      const roleToUpdate = await this.roleRepository.findOne({ where: { id } });
      if (!roleToUpdate) {
        throw new NotFoundException('Role not found for update.');
      }
      const updatedData = {
        ...roleDto,
        permissions: roleDto.permissions, // Directly assign the CRUD object
        editDate: new Date(),
      };
      Object.assign(roleToUpdate, updatedData);
      await this.roleRepository.save(roleToUpdate);
      return this.successResponse('Role updated successfully.');
    } catch (error) {
      return this.errorResponse('Failed to update role information.', error);
    }
  }

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

  async deleteRoleByName(roleName: string): Promise<any> {
    try {
      const rolesToDelete = await this.roleRepository.find({
        where: { roleName },
      });
      if (rolesToDelete.length === 0) {
        throw new NotFoundException(
          `No roles found with roleName "${roleName}".`,
        );
      }
      await this.roleRepository.delete({ roleName });
      return this.successResponse(
        `All roles with Rolename "${roleName}" deleted successfully.`,
      );
    } catch (error) {
      return this.errorResponse(
        `Failed to delete roles with roleName "${roleName}".`,
        error,
      );
    }
  }

  private successResponse(message: string, data: any = null) {
    return { isSuccessful: true, message, data };
  }

  private errorResponse(message: string, error?: any) {
    console.error(error);
    return { isSuccessful: false, message, data: null };
  }
}
