import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../../shared/utils/constants';

export const ROLES_KEY = 'roles';
export const SetRole = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
