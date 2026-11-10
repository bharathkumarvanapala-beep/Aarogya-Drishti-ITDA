import {describe,it,expect} from 'vitest';
import {isUserAuthorizedForPortal} from '../../../context/AuthProvider';
import type {UserRole} from '../../../types';
describe('Role-aware frontend guard (server authorization tested separately)',()=>{
 const roles:UserRole[]=['health_worker','doctor','specialist','hospital_coordinator','admin','patient'];
 it.each(roles)('%s can enter only its assigned primary portal',(role)=>{for(const portal of roles)expect(isUserAuthorizedForPortal(role,portal)).toBe(role===portal);});
 it('preserves ASHA/ANM aliases without upgrading privileges',()=>{expect(isUserAuthorizedForPortal('asha','health_worker')).toBe(true);expect(isUserAuthorizedForPortal('anm','health_worker')).toBe(true);expect(isUserAuthorizedForPortal('asha','admin')).toBe(false);});
});
