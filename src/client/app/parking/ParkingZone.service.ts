import { injectable } from 'inversify';
import type { IParkingZoneDto } from '@shared/app/parking/AbstractParkingZone';
import { ParkingZone } from '@/app/parking/ParkingZone';

@injectable()
export class ParkingZoneService {
    create(dto: IParkingZoneDto): ParkingZone {
        return new ParkingZone(dto);
    }
}
