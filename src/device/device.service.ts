import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from './entity/device.entity';
import { CreateDeviceDto, UpdateDeviceDto } from './dto/device.dto';

export type AuthUserCtx = {
  id: number;
  pin: string;
  role: string; // e.g., 'root', 'CS - Admin'
  unit?: string; // resolved by controller from DB (user profile)
  department?: string; // legacy fallback if still present on user row
};

function normalizeRole(role?: string) {
  return (role ?? '').trim().toLowerCase();
}

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly repo: Repository<DeviceEntity>,
  ) {}

  private isRoot(user: AuthUserCtx): boolean {
    return (user.role ?? '').trim().toLowerCase() === 'root';
  }

  private getUserUnit(user: AuthUserCtx): string | undefined {
    // controller hydrates `unit`; keep fallback for legacy data
    return (user.unit ?? user.department) || undefined;
  }

  private assertCanAccessRow(user: AuthUserCtx, row: DeviceEntity) {
    if (this.isRoot(user)) return; // hard bypass
    const unit = this.getUserUnit(user);
    if (!unit || row.unit !== unit) {
      throw new ForbiddenException(
        'You are not allowed to access this record from another unit.',
      );
    }
  }

  async create(dto: CreateDeviceDto, user: AuthUserCtx) {
    const isRoot = this.isRoot(user);
    const userUnit = this.getUserUnit(user);

    if (!isRoot && dto.unit && dto.unit !== userUnit) {
      throw new ForbiddenException('Cannot create device for another unit.');
    }

    const toSave = this.repo.create({
      ...dto,
      // for non-root: force to own unit (even if dto.unit omitted)
      unit: isRoot ? (dto.unit ?? null) : (userUnit ?? null),
    });
    const saved = await this.repo.save(toSave);
    return { isSuccessful: true, message: 'Device created', data: saved };
  }

  async findAllForUser(user: AuthUserCtx) {
    if (this.isRoot(user)) {
      // return ALL rows; pass `where: undefined` (not `{}`) to be explicit
      const rows = await this.repo.find({
        where: undefined,
        order: { id: 'DESC' },
      });
      return { isSuccessful: true, message: 'Devices retrieved', data: rows };
    }

    const unit = this.getUserUnit(user);
    // if user has no unit (broken profile), show nothing safely
    const where = unit ? { unit } : { unit: '__NO_MATCH__' };
    const rows = await this.repo.find({ where, order: { id: 'DESC' } });
    return { isSuccessful: true, message: 'Devices retrieved', data: rows };
  }

  async findOneForUser(id: number, user: AuthUserCtx) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Device not found');
    this.assertCanAccessRow(user, row);
    return { isSuccessful: true, message: 'Device found', data: row };
  }

  async updateForUser(id: number, dto: UpdateDeviceDto, user: AuthUserCtx) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Device not found');
    this.assertCanAccessRow(user, row);

    const isRoot = this.isRoot(user);
    const userUnit = this.getUserUnit(user);

    if (!isRoot && dto.unit && dto.unit !== row.unit) {
      throw new ForbiddenException('Cannot move device to another unit.');
    }

    const merged = this.repo.merge(row, {
      ...dto,
      // non-root: never allow changing away from current/own unit
      unit: isRoot ? (dto.unit ?? row.unit) : (row.unit ?? userUnit ?? null),
    });
    const updated = await this.repo.save(merged);
    return { isSuccessful: true, message: 'Device updated', data: updated };
  }

  async removeForUser(id: number, user: AuthUserCtx) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Device not found');
    this.assertCanAccessRow(user, row);

    await this.repo.remove(row);
    return { isSuccessful: true, message: 'Device removed', data: null };
  }
}
