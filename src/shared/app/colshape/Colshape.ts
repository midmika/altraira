import type { AbstractPolygonColshape } from './AbstractPolygonColshape';
import type { AbstractSphereColshape } from './AbstractSphereColshape';

export type IAnyColshape = AbstractPolygonColshape<any> | AbstractSphereColshape<any>;
