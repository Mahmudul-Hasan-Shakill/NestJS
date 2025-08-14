"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const amc_entity_1 = require("./src/core_system/amc/entity/amc.entity");
const role_entity_1 = require("./src/role/entity/role.entity");
const user_entity_1 = require("./src/user/entity/user.entity");
const dynamic_schema_entity_1 = require("./src/dynamic_schema/entity/dynamic-schema.entity");
const vm_entity_1 = require("./src/core_system/vm/entity/vm.entity");
const application_entity_1 = require("./src/core_system/application/entity/application.entity");
const database_entity_1 = require("./src/core_system/database/entity/database.entity");
const physical_entity_1 = require("./src/core_system/physical/entity/physical.entity");
const automation_entity_1 = require("./src/core_system/automation/entity/automation.entity");
const cluster_entity_1 = require("./src/core_system/cluster/entity/cluster.entity");
const document_entity_1 = require("./src/document/entity/document.entity");
const physical_host_entity_1 = require("./src/core_system/physical_host/entity/physical-host.entity");
const getDatabaseConfig = (configService) => {
    return {
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
            user_entity_1.UserEntity,
            role_entity_1.RoleEntity,
            amc_entity_1.AmcEntity,
            document_entity_1.DocumentEntity,
            dynamic_schema_entity_1.DynamicSchemaEntity,
            vm_entity_1.VmEntity,
            application_entity_1.ApplicationEntity,
            database_entity_1.DatabaseEntity,
            physical_entity_1.PhysicalEntity,
            automation_entity_1.AutomationEntity,
            cluster_entity_1.ClusterEntity,
            physical_host_entity_1.PhysicalHostEntity,
        ],
        synchronize: true,
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
exports.default = (configService) => (0, exports.getDatabaseConfig)(configService);
//# sourceMappingURL=ormconfig.js.map