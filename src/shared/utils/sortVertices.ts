import type { IVector2 } from 'alt-shared';
import { calculateCentroid } from './calculateCentroid';

export function sortVertices(vertices: IVector2[]): IVector2[] {
    const centroid = calculateCentroid(vertices);

    // Функция для вычисления угла между вектором от центроида к вершине и осью X
    function angle(point: IVector2): number {
        return Math.atan2(point.y - centroid.y, point.x - centroid.x);
    }

    // Сортируем вершины по углу
    return vertices.sort((a, b) => angle(a) - angle(b));
}
