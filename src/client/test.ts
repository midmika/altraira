import * as alt from 'alt-client';
import * as native from 'natives';

const Registered = [];
const ZoneManager_Player = alt.Player.local;
const PlayerDimension = 0;

export const types = {
    '2PointZone': 1,
    '4PointZone': 2,
    '6PointZone': 3,
    NPointZone: 4,
};

export function IsZoneRegistered(zoneName, dimension) {
    const ClonedZoneList = JSON.parse(JSON.stringify(Registered));
    for (const i in ClonedZoneList) {
        const ZoneManagerObject = ClonedZoneList[i];
        if (ZoneManagerObject.zoneName == zoneName && ZoneManagerObject.dimension == dimension) return true;
    }
    return false;
}

export function GetZoneByName(zoneName, dimension) {
    for (const i in Registered) {
        const ZoneManagerObject = Registered[i];
        if (ZoneManagerObject.zoneName == zoneName && ZoneManagerObject.dimension == dimension)
            return ZoneManagerObject;
    }
    return undefined;
}

export function GetZoneByIndex(zoneZindex) {
    return Registered[zoneZindex] || undefined;
}

export function UnregisterZone(zoneName, dimension) {
    for (const i in Registered) {
        const ZoneManagerObject = Registered[i];
        if (ZoneManagerObject.zoneName == zoneName && ZoneManagerObject.dimension == dimension) {
            Registered.splice(i, 1);
            return true;
        }
    }
    return false;
}

export function RegisterZone(Vectors, height, zoneName, type, dimension) {
    for (const i in Registered) {
        const ZoneManagerObject = Registered[i];
        if (ZoneManagerObject.zoneName == zoneName && ZoneManagerObject.dimension == dimension) return undefined;
    }
    if (type == types['2PointZone']) {
        var ZoneObject = {};
        ZoneObject.firstvec = Vectors[0];
        ZoneObject.secondvec = Vectors[1];
        ZoneObject.collieded = false;
        ZoneObject.zoneName = zoneName;
        ZoneObject.type = types['2PointZone'];
        ZoneObject.dimension = dimension;
        ZoneObject.data = {};

        Registered.push(ZoneObject);
        return ZoneObject;
    } else if (type == types['4PointZone']) {
        var ZoneObject = {};
        ZoneObject.firstvec = Vectors[0];
        ZoneObject.secondvec = Vectors[1];
        ZoneObject.thirdvec = Vectors[2];
        ZoneObject.forthvec = Vectors[3];
        ZoneObject.height = height;
        ZoneObject.collieded = false;
        ZoneObject.zoneName = zoneName;
        ZoneObject.type = types['4PointZone'];
        ZoneObject.dimension = dimension;
        ZoneObject.data = {};

        Registered.push(ZoneObject);
        return ZoneObject;
    } else if (type == types['6PointZone']) {
        var ZoneObject = {};
        ZoneObject.firstvec = Vectors[0];
        ZoneObject.secondvec = Vectors[1];
        ZoneObject.thirdvec = Vectors[2];
        ZoneObject.forthvec = Vectors[3];
        ZoneObject.fifthvec = Vectors[4];
        ZoneObject.sixthvec = Vectors[5];
        ZoneObject.height = height;
        ZoneObject.collieded = false;
        ZoneObject.zoneName = zoneName;
        ZoneObject.type = types['6PointZone'];
        ZoneObject.dimension = dimension;
        ZoneObject.data = {};

        Registered.push(ZoneObject);
        return ZoneObject;
    } else if (type == types['NPointZone']) {
        if (Vectors.length > 2) {
            var ZoneObject = {};
            ZoneObject.vectors = Vectors;
            ZoneObject.height = height;
            ZoneObject.collieded = false;
            ZoneObject.zoneName = zoneName;
            ZoneObject.type = types['NPointZone'];
            ZoneObject.dimension = dimension;
            ZoneObject.data = {};

            Registered.push(ZoneObject);
            return ZoneObject;
        } else return undefined;
    } else return undefined;
}

export function DrawZoneBy2(startPosition, endPosition, r = 255, g = 0, b = 0, a = 255) {
    const startXVetor = new alt.Vector3(endPosition.x, startPosition.y, startPosition.z);
    const startYVector = new alt.Vector3(startPosition.x, endPosition.y, startPosition.z);
    const startZVector = new alt.Vector3(startPosition.x, startPosition.y, endPosition.z);

    const endXVector = new alt.Vector3(startPosition.x, endPosition.y, endPosition.z);
    const endYVector = new alt.Vector3(endPosition.x, startPosition.y, endPosition.z);
    const endZVector = new alt.Vector3(endPosition.x, endPosition.y, startPosition.z);

    alt.setInterval(() => {
        native.drawLine(
            endZVector.x,
            endZVector.y,
            endZVector.z,
            startXVetor.x,
            startXVetor.y,
            startXVetor.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            endZVector.x,
            endZVector.y,
            endZVector.z,
            startYVector.x,
            startYVector.y,
            startYVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            startPosition.x,
            startPosition.y,
            startYVector.z,
            startYVector.x,
            startYVector.y,
            startYVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            startPosition.x,
            startPosition.y,
            startXVetor.z,
            startXVetor.x,
            startXVetor.y,
            startXVetor.z,
            r,
            g,
            b,
            a,
        );
        // Bottom Or Top
        native.drawLine(
            startZVector.x,
            startZVector.y,
            startZVector.z,
            endXVector.x,
            endXVector.y,
            endXVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            startZVector.x,
            startZVector.y,
            startZVector.z,
            endYVector.x,
            endYVector.y,
            endYVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            endPosition.x,
            endPosition.y,
            endPosition.z,
            endXVector.x,
            endXVector.y,
            endXVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            endPosition.x,
            endPosition.y,
            endPosition.z,
            endYVector.x,
            endYVector.y,
            endYVector.z,
            r,
            g,
            b,
            a,
        );
        //Connections
        native.drawLine(
            startPosition.x,
            startPosition.y,
            startPosition.z,
            startZVector.x,
            startZVector.y,
            startZVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            endPosition.x,
            endPosition.y,
            endPosition.z,
            endZVector.x,
            endZVector.y,
            endZVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            endXVector.x,
            endXVector.y,
            endXVector.z,
            startYVector.x,
            startYVector.y,
            startYVector.z,
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            startXVetor.x,
            startXVetor.y,
            startXVetor.z,
            endYVector.x,
            endYVector.y,
            endYVector.z,
            r,
            g,
            b,
            a,
        );
    }, 5);
}

export function DrawZoneBy4(Vectors, height, r = 255, g = 0, b = 0, a = 255) {
    return alt.setInterval(() => {
        // Bottom
        native.drawLine(Vectors[0].x, Vectors[0].y, Vectors[0].z, Vectors[1].x, Vectors[1].y, Vectors[1].z, r, g, b, a);
        native.drawLine(Vectors[1].x, Vectors[1].y, Vectors[1].z, Vectors[2].x, Vectors[2].y, Vectors[2].z, r, g, b, a);
        native.drawLine(Vectors[2].x, Vectors[2].y, Vectors[2].z, Vectors[3].x, Vectors[3].y, Vectors[3].z, r, g, b, a);
        native.drawLine(Vectors[3].x, Vectors[3].y, Vectors[3].z, Vectors[1].x, Vectors[1].y, Vectors[1].z, r, g, b, a);
        //Top
        native.drawLine(
            Vectors[0].x,
            Vectors[0].y,
            Vectors[0].z + parseFloat(height),
            Vectors[1].x,
            Vectors[1].y,
            Vectors[1].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[1].x,
            Vectors[1].y,
            Vectors[1].z + parseFloat(height),
            Vectors[2].x,
            Vectors[2].y,
            Vectors[2].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[2].x,
            Vectors[2].y,
            Vectors[2].z + parseFloat(height),
            Vectors[3].x,
            Vectors[3].y,
            Vectors[3].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[3].x,
            Vectors[3].y,
            Vectors[3].z + parseFloat(height),
            Vectors[0].x,
            Vectors[0].y,
            Vectors[0].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        //Cennections
        native.drawLine(
            Vectors[0].x,
            Vectors[0].y,
            Vectors[0].z,
            Vectors[0].x,
            Vectors[0].y,
            Vectors[0].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[1].x,
            Vectors[1].y,
            Vectors[1].z,
            Vectors[1].x,
            Vectors[1].y,
            Vectors[1].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[2].x,
            Vectors[2].y,
            Vectors[2].z,
            Vectors[2].x,
            Vectors[2].y,
            Vectors[2].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[3].x,
            Vectors[3].y,
            Vectors[3].z,
            Vectors[3].x,
            Vectors[3].y,
            Vectors[3].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
    }, 5);
}

export function DrawZoneBy6(Vectors, height, r = 255, g = 0, b = 0, a = 255) {
    return alt.setInterval(() => {
        // Bottom
        native.drawLine(Vectors[0].x, Vectors[0].y, Vectors[0].z, Vectors[1].x, Vectors[1].y, Vectors[1].z, r, g, b, a);
        native.drawLine(Vectors[1].x, Vectors[1].y, Vectors[1].z, Vectors[2].x, Vectors[2].y, Vectors[2].z, r, g, b, a);
        native.drawLine(Vectors[2].x, Vectors[2].y, Vectors[2].z, Vectors[3].x, Vectors[3].y, Vectors[3].z, r, g, b, a);
        native.drawLine(Vectors[3].x, Vectors[3].y, Vectors[3].z, Vectors[4].x, Vectors[4].y, Vectors[4].z, r, g, b, a);
        native.drawLine(Vectors[4].x, Vectors[4].y, Vectors[4].z, Vectors[5].x, Vectors[5].y, Vectors[5].z, r, g, b, a);
        native.drawLine(Vectors[5].x, Vectors[5].y, Vectors[5].z, Vectors[0].x, Vectors[0].y, Vectors[0].z, r, g, b, a);
        //
        native.drawLine(
            Vectors[0].x,
            Vectors[0].y,
            Vectors[0].z + parseFloat(height),
            Vectors[1].x,
            Vectors[1].y,
            Vectors[1].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[1].x,
            Vectors[1].y,
            Vectors[1].z + parseFloat(height),
            Vectors[2].x,
            Vectors[2].y,
            Vectors[2].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[2].x,
            Vectors[2].y,
            Vectors[2].z + parseFloat(height),
            Vectors[3].x,
            Vectors[3].y,
            Vectors[3].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[3].x,
            Vectors[3].y,
            Vectors[3].z + parseFloat(height),
            Vectors[4].x,
            Vectors[4].y,
            Vectors[4].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[4].x,
            Vectors[4].y,
            Vectors[4].z + parseFloat(height),
            Vectors[5].x,
            Vectors[5].y,
            Vectors[5].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[5].x,
            Vectors[5].y,
            Vectors[5].z + parseFloat(height),
            Vectors[0].x,
            Vectors[0].y,
            Vectors[0].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        //Cennections
        native.drawLine(
            Vectors[0].x,
            Vectors[0].y,
            Vectors[0].z,
            Vectors[0].x,
            Vectors[0].y,
            Vectors[0].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[1].x,
            Vectors[1].y,
            Vectors[1].z,
            Vectors[1].x,
            Vectors[1].y,
            Vectors[1].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[2].x,
            Vectors[2].y,
            Vectors[2].z,
            Vectors[2].x,
            Vectors[2].y,
            Vectors[2].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[3].x,
            Vectors[3].y,
            Vectors[3].z,
            Vectors[3].x,
            Vectors[3].y,
            Vectors[3].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[4].x,
            Vectors[4].y,
            Vectors[4].z,
            Vectors[4].x,
            Vectors[4].y,
            Vectors[4].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
        native.drawLine(
            Vectors[5].x,
            Vectors[5].y,
            Vectors[5].z,
            Vectors[5].x,
            Vectors[5].y,
            Vectors[5].z + parseFloat(height),
            r,
            g,
            b,
            a,
        );
    }, 5);
}

export function DrawZoneByN(Vectors, height, r = 255, g = 0, b = 0, a = 255) {
    return alt.setInterval(() => {
        const TotalLengthOfVectors = parseInt(Vectors.length, 10);
        for (let i in Vectors) {
            if (i != TotalLengthOfVectors - 1) {
                i = parseInt(i, 10);
                var CurrentVector = Vectors[i];
                var NextVector = Vectors[i + 1];

                var CurrentVectorUp = new alt.Vector3(
                    CurrentVector.x,
                    CurrentVector.y,
                    CurrentVector.z + parseFloat(height),
                );
                var NextVectorUp = new alt.Vector3(NextVector.x, NextVector.y, NextVector.z + parseFloat(height));

                native.drawLine(
                    CurrentVector.x,
                    CurrentVector.y,
                    CurrentVector.z,
                    NextVector.x,
                    NextVector.y,
                    NextVector.z,
                    r,
                    g,
                    b,
                    a,
                );
                native.drawLine(
                    CurrentVector.x,
                    CurrentVector.y,
                    CurrentVector.z,
                    CurrentVectorUp.x,
                    CurrentVectorUp.y,
                    CurrentVectorUp.z,
                    r,
                    g,
                    b,
                    a,
                );
                native.drawLine(
                    NextVector.x,
                    NextVector.y,
                    NextVector.z,
                    NextVectorUp.x,
                    NextVectorUp.y,
                    NextVectorUp.z,
                    r,
                    g,
                    b,
                    a,
                );
                native.drawLine(
                    CurrentVectorUp.x,
                    CurrentVectorUp.y,
                    CurrentVectorUp.z,
                    NextVectorUp.x,
                    NextVectorUp.y,
                    NextVectorUp.z,
                    r,
                    g,
                    b,
                    a,
                );
            } else {
                var CurrentVector = Vectors[i];
                var NextVector = Vectors[0];

                var CurrentVectorUp = new alt.Vector3(
                    CurrentVector.x,
                    CurrentVector.y,
                    CurrentVector.z + parseFloat(height),
                );
                var NextVectorUp = new alt.Vector3(NextVector.x, NextVector.y, NextVector.z + parseFloat(height));

                native.drawLine(
                    CurrentVector.x,
                    CurrentVector.y,
                    CurrentVector.z,
                    NextVector.x,
                    NextVector.y,
                    NextVector.z,
                    r,
                    g,
                    b,
                    a,
                );
                native.drawLine(
                    CurrentVector.x,
                    CurrentVector.y,
                    CurrentVector.z,
                    CurrentVectorUp.x,
                    CurrentVectorUp.y,
                    CurrentVectorUp.z,
                    r,
                    g,
                    b,
                    a,
                );
                native.drawLine(
                    NextVector.x,
                    NextVector.y,
                    NextVector.z,
                    NextVectorUp.x,
                    NextVectorUp.y,
                    NextVectorUp.z,
                    r,
                    g,
                    b,
                    a,
                );
                native.drawLine(
                    CurrentVectorUp.x,
                    CurrentVectorUp.y,
                    CurrentVectorUp.z,
                    NextVectorUp.x,
                    NextVectorUp.y,
                    NextVectorUp.z,
                    r,
                    g,
                    b,
                    a,
                );
            }
        }
    }, 5);
}

export function IsPointInZone(point, zoneName, dimension) {
    for (const i in Registered) {
        const ZoneObject = Registered[i];
        if (ZoneObject.zoneName == zoneName && ZoneObject.dimension == dimension) {
            const ZoneType = ZoneObject.type;
            if (ZoneType == types['NPointZone']) {
                var PointVector = point;
                var ZoneHeight = ZoneObject.height;
                const Vectors = ZoneObject.vectors;

                var pointInside = [PointVector.x, PointVector.y];
                var ShapeCoords = [];

                for (const i in Vectors) {
                    const VectorObject = Vectors[i];

                    const VectorObjectZ = VectorObject.z;
                    const VectorObjectZ_Height = VectorObject.z + parseFloat(ZoneHeight);

                    if (PointVector.z > VectorObjectZ && PointVector.z < VectorObjectZ_Height) {
                        const AddingVec = [VectorObject.x, VectorObject.y];
                        ShapeCoords.push(AddingVec);
                        continue;
                    } else return false;
                }
                if (inside(pointInside, ShapeCoords)) return true;
                else return false;
            } else if (ZoneType == types['6PointZone']) {
                var FirstVector = ZoneObject.firstvec;
                var SecondVector = ZoneObject.secondvec;
                var ThirdVector = ZoneObject.thirdvec;
                var ForthVector = ZoneObject.forthvec;
                const FifthVector = ZoneObject.fifthvec;
                const SixthVector = ZoneObject.sixthvec;
                var ZoneHeight = ZoneObject.height;
                var PointVector = point;
                var ZFirstVector = FirstVector.z;
                var ZFirstVector_Height = FirstVector.z + parseFloat(ZoneHeight);
                var ZSecondVector = SecondVector.z;
                var ZSecondVector_Height = SecondVector.z + parseFloat(ZoneHeight);
                var ZThirdVector = ThirdVector.z;
                var ZThirdVector_Height = ThirdVector.z + parseFloat(ZoneHeight);
                var ZForthVector = ForthVector.z;
                var ZForthVector_Height = ForthVector.z + parseFloat(ZoneHeight);
                const ZFifthVector = FifthVector.z;
                const ZFifthVecotr_Height = FifthVector.z + parseFloat(ZoneHeight);
                const ZSixthVector = SixthVector.z;
                const ZSixthVector_Height = SixthVector.z + parseFloat(ZoneHeight);

                if (
                    (PointVector.z > ZFirstVector && PointVector.z < ZFirstVector_Height) ||
                    (PointVector.z > ZSecondVector && PointVector.z < ZSecondVector_Height) ||
                    (PointVector.z > ZThirdVector && PointVector.z < ZThirdVector_Height) ||
                    (PointVector.z > ZForthVector && PointVector.z < ZForthVector_Height) ||
                    (PointVector.z > ZFifthVector && PointVector.z < ZFifthVecotr_Height) ||
                    (PointVector.z > ZSixthVector && PointVector.z < ZSixthVector_Height)
                ) {
                    var pointInside = [PointVector.x, PointVector.y];
                    var ShapeCoords = [
                        [FirstVector.x, FirstVector.y],
                        [SecondVector.x, SecondVector.y],
                        [ThirdVector.x, ThirdVector.y],
                        [ForthVector.x, ForthVector.y],
                        [FifthVector.x, FifthVector.y],
                        [SixthVector.x, SixthVector.y],
                    ];

                    if (inside(pointInside, ShapeCoords)) return true;
                    else return false;
                } else return false;
            } else if (ZoneType == types['4PointZone']) {
                var FirstVector = ZoneObject.firstvec;
                var SecondVector = ZoneObject.secondvec;
                var ThirdVector = ZoneObject.thirdvec;
                var ForthVector = ZoneObject.forthvec;
                var ZoneHeight = ZoneObject.height;
                var PointVector = point;
                var ZFirstVector = FirstVector.z;
                var ZFirstVector_Height = FirstVector.z + parseFloat(ZoneHeight);
                var ZSecondVector = SecondVector.z;
                var ZSecondVector_Height = SecondVector.z + parseFloat(ZoneHeight);
                var ZThirdVector = ThirdVector.z;
                var ZThirdVector_Height = ThirdVector.z + parseFloat(ZoneHeight);
                var ZForthVector = ForthVector.z;
                var ZForthVector_Height = ForthVector.z + parseFloat(ZoneHeight);

                if (
                    (PointVector.z > ZFirstVector && PointVector.z < ZFirstVector_Height) ||
                    (PointVector.z > ZSecondVector && PointVector.z < ZSecondVector_Height) ||
                    (PointVector.z > ZThirdVector && PointVector.z < ZThirdVector_Height) ||
                    (PointVector.z > ZForthVector && PointVector.z < ZForthVector_Height)
                ) {
                    var pointInside = [PointVector.x, PointVector.y];
                    var ShapeCoords = [
                        [FirstVector.x, FirstVector.y],
                        [SecondVector.x, SecondVector.y],
                        [ThirdVector.x, ThirdVector.y],
                        [ForthVector.x, ForthVector.y],
                    ];

                    if (inside(pointInside, ShapeCoords)) return true;
                    else return false;
                } else return false;
            } else if (ZoneType == types['2PointZone']) {
                var FirstVector = ZoneObject.firstvec;
                var SecondVector = ZoneObject.secondvec;
                var PointVector = ZoneManager_Player.pos;

                if (FirstVector.x > SecondVector.x) {
                    if (PointVector.x < FirstVector.x && SecondVector.x < PointVector.x) {
                        if (FirstVector.y > SecondVector.y) {
                            if (PointVector.y < FirstVector.y && SecondVector.y < PointVector.y) {
                                if (FirstVector.z > SecondVector.z) {
                                    if (PointVector.z < FirstVector.z && SecondVector.z < PointVector.z) return true;
                                    else return false;
                                } else if (FirstVector.z < SecondVector.z) {
                                    if (PointVector.z < SecondVector.z && FirstVector.z < PointVector.z) return true;
                                    else return false;
                                }
                            } else return false;
                        } else if (FirstVector.y < SecondVector.y) {
                            if (PointVector.y < SecondVector.y && FirstVector.y < PointVector.y) {
                                if (FirstVector.z > SecondVector.z) {
                                    if (PointVector.z < FirstVector.z && SecondVector.z < PointVector.z) return true;
                                    else return false;
                                } else if (FirstVector.z < SecondVector.z) {
                                    if (PointVector.z < SecondVector.z && FirstVector.z < PointVector.z) return true;
                                    else return false;
                                }
                            } else return false;
                        }
                    } else return false;
                } else if (FirstVector.x < SecondVector.x) {
                    if (PointVector.x < SecondVector.x && FirstVector.x < PointVector.x) {
                        if (FirstVector.y > SecondVector.y) {
                            if (PointVector.y < FirstVector.y && SecondVector.y < PointVector.y) {
                                if (FirstVector.z > SecondVector.z) {
                                    if (PointVector.z < FirstVector.z && SecondVector.z < PointVector.z) return true;
                                    else return false;
                                } else if (FirstVector.z < SecondVector.z) {
                                    if (PointVector.z < SecondVector.z && FirstVector.z < PointVector.z) return true;
                                    else return false;
                                }
                            } else return false;
                        } else if (FirstVector.y < SecondVector.y) {
                            if (PointVector.y < SecondVector.y && FirstVector.y < PointVector.y) {
                                if (FirstVector.z > SecondVector.z) {
                                    if (PointVector.z < FirstVector.z && SecondVector.z < PointVector.z) return true;
                                    else return false;
                                } else if (FirstVector.z < SecondVector.z) {
                                    if (PointVector.z < SecondVector.z && FirstVector.z < PointVector.z) return true;
                                    else return false;
                                }
                            } else return false;
                        }
                    } else return false;
                }
            }
        } else return false;
    }
}

alt.everyTick(() => {
    Registered.map((ZoneObject, index, ZoneArray) => {
        if (PlayerDimension != ZoneObject.dimension) {
            if (ZoneObject.collieded) {
                alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                ZoneObject.collieded = false;
                ZoneArray[index] = ZoneObject;
            }
        } else if (ZoneObject.type == types['2PointZone']) {
            var FirstVector = ZoneObject.firstvec;
            var SecondVector = ZoneObject.secondvec;
            var PointVector = ZoneManager_Player.pos;

            if (FirstVector.x > SecondVector.x) {
                if (PointVector.x < FirstVector.x && SecondVector.x < PointVector.x) {
                    if (FirstVector.y > SecondVector.y) {
                        if (PointVector.y < FirstVector.y && SecondVector.y < PointVector.y) {
                            if (FirstVector.z > SecondVector.z) {
                                if (PointVector.z < FirstVector.z && SecondVector.z < PointVector.z) {
                                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = true;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                } else {
                                    if (ZoneObject.collieded) {
                                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = false;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                }
                            } else if (FirstVector.z < SecondVector.z) {
                                if (PointVector.z < SecondVector.z && FirstVector.z < PointVector.z) {
                                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = true;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                } else {
                                    if (ZoneObject.collieded) {
                                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = false;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                }
                            }
                        } else {
                            if (ZoneObject.collieded) {
                                alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                ZoneObject.collieded = false;
                                ZoneArray[index] = ZoneObject;
                            }
                        }
                    } else if (FirstVector.y < SecondVector.y) {
                        if (PointVector.y < SecondVector.y && FirstVector.y < PointVector.y) {
                            if (FirstVector.z > SecondVector.z) {
                                if (PointVector.z < FirstVector.z && SecondVector.z < PointVector.z) {
                                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);

                                        ZoneObject.collieded = true;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                } else {
                                    if (ZoneObject.collieded) {
                                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = false;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                }
                            } else if (FirstVector.z < SecondVector.z) {
                                if (PointVector.z < SecondVector.z && FirstVector.z < PointVector.z) {
                                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);

                                        ZoneObject.collieded = true;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                } else {
                                    if (ZoneObject.collieded) {
                                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = false;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                }
                            }
                        } else {
                            if (ZoneObject.collieded) {
                                alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                ZoneObject.collieded = false;
                                ZoneArray[index] = ZoneObject;
                            }
                        }
                    }
                } else {
                    if (ZoneObject.collieded) {
                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                        ZoneObject.collieded = false;
                        ZoneArray[index] = ZoneObject;
                    }
                }
            } else if (FirstVector.x < SecondVector.x) {
                if (PointVector.x < SecondVector.x && FirstVector.x < PointVector.x) {
                    if (FirstVector.y > SecondVector.y) {
                        if (PointVector.y < FirstVector.y && SecondVector.y < PointVector.y) {
                            if (FirstVector.z > SecondVector.z) {
                                if (PointVector.z < FirstVector.z && SecondVector.z < PointVector.z) {
                                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = true;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                } else {
                                    if (ZoneObject.collieded) {
                                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = false;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                }
                            } else if (FirstVector.z < SecondVector.z) {
                                if (PointVector.z < SecondVector.z && FirstVector.z < PointVector.z) {
                                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = true;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                } else {
                                    if (ZoneObject.collieded) {
                                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = false;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                }
                            }
                        } else {
                            if (ZoneObject.collieded) {
                                alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                ZoneObject.collieded = false;
                                ZoneArray[index] = ZoneObject;
                            }
                        }
                    } else if (FirstVector.y < SecondVector.y) {
                        if (PointVector.y < SecondVector.y && FirstVector.y < PointVector.y) {
                            if (FirstVector.z > SecondVector.z) {
                                if (PointVector.z < FirstVector.z && SecondVector.z < PointVector.z) {
                                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = true;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                } else {
                                    if (ZoneObject.collieded) {
                                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = false;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                }
                            } else if (FirstVector.z < SecondVector.z) {
                                if (PointVector.z < SecondVector.z && FirstVector.z < PointVector.z) {
                                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = true;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                } else {
                                    if (ZoneObject.collieded) {
                                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                        ZoneObject.collieded = false;
                                        ZoneArray[index] = ZoneObject;
                                    }
                                }
                            }
                        } else {
                            if (ZoneObject.collieded) {
                                alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                                ZoneObject.collieded = false;
                                ZoneArray[index] = ZoneObject;
                            }
                        }
                    }
                } else {
                    if (ZoneObject.collieded) {
                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                        ZoneObject.collieded = false;
                        ZoneArray[index] = ZoneObject;
                    }
                }
            }
        } else if (ZoneObject.type == types['4PointZone']) {
            var FirstVector = ZoneObject.firstvec;
            var SecondVector = ZoneObject.secondvec;
            var ThirdVector = ZoneObject.thirdvec;
            var ForthVector = ZoneObject.forthvec;
            var ZoneHeight = ZoneObject.height;
            var PointVector = ZoneManager_Player.pos;

            var ZFirstVector = FirstVector.z;
            var ZFirstVector_Height = FirstVector.z + parseFloat(ZoneHeight);

            var ZSecondVector = SecondVector.z;
            var ZSecondVector_Height = SecondVector.z + parseFloat(ZoneHeight);

            var ZThirdVector = ThirdVector.z;
            var ZThirdVector_Height = ThirdVector.z + parseFloat(ZoneHeight);

            var ZForthVector = ForthVector.z;
            var ZForthVector_Height = ForthVector.z + parseFloat(ZoneHeight);

            if (
                (PointVector.z > ZFirstVector && PointVector.z < ZFirstVector_Height) ||
                (PointVector.z > ZSecondVector && PointVector.z < ZSecondVector_Height) ||
                (PointVector.z > ZThirdVector && PointVector.z < ZThirdVector_Height) ||
                (PointVector.z > ZForthVector && PointVector.z < ZForthVector_Height)
            ) {
                var pointInside = [PointVector.x, PointVector.y];
                var ShapeCoords = [
                    [FirstVector.x, FirstVector.y],
                    [SecondVector.x, SecondVector.y],
                    [ThirdVector.x, ThirdVector.y],
                    [ForthVector.x, ForthVector.y],
                ];

                if (inside(pointInside, ShapeCoords)) {
                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                        ZoneObject.collieded = true;
                        ZoneArray[index] = ZoneObject;
                    }
                } else {
                    if (ZoneObject.collieded) {
                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                        ZoneObject.collieded = false;
                        ZoneArray[index] = ZoneObject;
                    }
                }
            } else {
                if (ZoneObject.collieded) {
                    alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                    ZoneObject.collieded = false;
                    ZoneArray[index] = ZoneObject;
                }
            }
        } else if (ZoneObject.type == types['6PointZone']) {
            var FirstVector = ZoneObject.firstvec;
            var SecondVector = ZoneObject.secondvec;
            var ThirdVector = ZoneObject.thirdvec;
            var ForthVector = ZoneObject.forthvec;
            const FifthVector = ZoneObject.fifthvec;
            const SixthVector = ZoneObject.sixthvec;

            var ZoneHeight = ZoneObject.height;
            var PointVector = ZoneManager_Player.pos;

            var ZFirstVector = FirstVector.z;
            var ZFirstVector_Height = FirstVector.z + parseFloat(ZoneHeight);

            var ZSecondVector = SecondVector.z;
            var ZSecondVector_Height = SecondVector.z + parseFloat(ZoneHeight);

            var ZThirdVector = ThirdVector.z;
            var ZThirdVector_Height = ThirdVector.z + parseFloat(ZoneHeight);

            var ZForthVector = ForthVector.z;
            var ZForthVector_Height = ForthVector.z + parseFloat(ZoneHeight);

            const ZFifthVector = FifthVector.z;
            const ZFifthVecotr_Height = FifthVector.z + parseFloat(ZoneHeight);

            const ZSixthVector = SixthVector.z;
            const ZSixthVector_Height = SixthVector.z + parseFloat(ZoneHeight);

            if (
                (PointVector.z > ZFirstVector && PointVector.z < ZFirstVector_Height) ||
                (PointVector.z > ZSecondVector && PointVector.z < ZSecondVector_Height) ||
                (PointVector.z > ZThirdVector && PointVector.z < ZThirdVector_Height) ||
                (PointVector.z > ZForthVector && PointVector.z < ZForthVector_Height) ||
                (PointVector.z > ZFifthVector && PointVector.z < ZFifthVecotr_Height) ||
                (PointVector.z > ZSixthVector && PointVector.z < ZSixthVector_Height)
            ) {
                var pointInside = [PointVector.x, PointVector.y];
                var ShapeCoords = [
                    [FirstVector.x, FirstVector.y],
                    [SecondVector.x, SecondVector.y],
                    [ThirdVector.x, ThirdVector.y],
                    [ForthVector.x, ForthVector.y],
                    [FifthVector.x, FifthVector.y],
                    [SixthVector.x, SixthVector.y],
                ];

                if (inside(pointInside, ShapeCoords)) {
                    if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                        alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                        ZoneObject.collieded = true;
                        ZoneArray[index] = ZoneObject;
                    }
                } else {
                    if (ZoneObject.collieded) {
                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                        ZoneObject.collieded = false;
                        ZoneArray[index] = ZoneObject;
                    }
                }
            } else {
                if (ZoneObject.collieded) {
                    alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                    ZoneObject.collieded = false;
                    ZoneArray[index] = ZoneObject;
                }
            }
        } else if (ZoneObject.type == types['NPointZone']) {
            var PointVector = ZoneManager_Player.pos;
            var ZoneHeight = ZoneObject.height;
            const Vectors = ZoneObject.vectors;

            var pointInside = [PointVector.x, PointVector.y];
            var ShapeCoords = [];

            for (const i in Vectors) {
                const VectorObject = Vectors[i];

                const VectorObjectZ = VectorObject.z;
                const VectorObjectZ_Height = VectorObject.z + parseFloat(ZoneHeight);

                if (PointVector.z > VectorObjectZ && PointVector.z < VectorObjectZ_Height) {
                    const AddingVec = [VectorObject.x, VectorObject.y];
                    ShapeCoords.push(AddingVec);
                    continue;
                } else {
                    if (ZoneObject.collieded) {
                        alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                        ZoneObject.collieded = false;
                        ZoneArray[index] = ZoneObject;
                    }
                    return;
                }
            }
            if (inside(pointInside, ShapeCoords)) {
                if (!ZoneObject.collieded && PlayerDimension == ZoneObject.dimension) {
                    alt.emit('ZoneManager_PlayerEnterZone', ZoneObject.zoneName);
                    ZoneObject.collieded = true;
                    ZoneArray[index] = ZoneObject;
                }
            } else {
                if (ZoneObject.collieded) {
                    alt.emit('ZoneManager_PlayerExitZone', ZoneObject.zoneName);
                    ZoneObject.collieded = false;
                    ZoneArray[index] = ZoneObject;
                }
            }
        }
    });
});

function GetLowestNumberOfArray(numberArray) {
    let LastLowestNumber = numberArray[0];
    for (const i in numberArray) {
        const LowNumber = numberArray[i];
        if (LowNumber < LastLowestNumber) LastLowestNumber = LowNumber;
    }
    return LastLowestNumber;
}

function GetHighestNumberOfArray(numberArray) {
    let LastHighestNumber = numberArray[0];
    for (const i in numberArray) {
        const HighNumber = numberArray[i];
        if (HighNumber > LastHighestNumber) LastHighestNumber = HighNumber;
    }
    return LastHighestNumber;
}

function inside(point, vs) {
    const x = point[0],
        y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0],
            yi = vs[i][1];
        const xj = vs[j][0],
            yj = vs[j][1];
        const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

function getAreaOf2DPolygon(points) {
    let sumX = parseInt(0, 10);
    let sumY = parseInt(0, 10);

    for (const i in points) {
        if (i < points.length - 1) {
            const currentPointX = points[parseInt(i, 10)][0];
            const nextPointY = points[parseInt(i, 10) + 1][1];

            const currentPointY = points[i][1];
            const nextPointX = points[parseInt(i, 10) + 1][0];

            sumX += currentPointX * nextPointY;
            sumY += currentPointY * nextPointX;
        } else {
            const currentPointX = points[parseInt(i, 10)][0];
            const nextPointY = points[0][1];

            const currentPointY = points[i][1];
            const nextPointX = points[0][0];

            sumX += currentPointX * nextPointY;
            sumY += currentPointY * nextPointX;
        }
    }
    return (sumX - sumY) / 2;
}

function getCenter(points, area) {
    const centerX = 1 / (6 * area);
    const centerY = 1 / (6 * area);

    let centerXSum = 0.0;
    let centerYSum = 0.0;
    for (const i in points) {
        if (i < points.length - 1) {
            centerXSum +=
                (points[parseInt(i, 10)][0] + points[parseInt(i, 10) + 1][0]) *
                (points[parseInt(i, 10)][0] * points[parseInt(i, 10) + 1][1] -
                    points[parseInt(i, 10) + 1][0] * points[parseInt(i, 10)][1]);
            centerYSum +=
                (points[parseInt(i, 10)][1] + points[parseInt(i, 10) + 1][1]) *
                (points[parseInt(i, 10)][0] * points[parseInt(i, 10) + 1][1] -
                    points[parseInt(i, 10) + 1][0] * points[parseInt(i, 10)][1]);
        } else {
            centerXSum +=
                (points[parseInt(i, 10)][0] + points[0][0]) *
                (points[parseInt(i, 10)][0] * points[0][1] - points[0][0] * points[parseInt(i, 10)][1]);
            centerYSum +=
                (points[parseInt(i, 10)][1] + points[0][1]) *
                (points[parseInt(i, 10)][0] * points[0][1] - points[0][0] * points[parseInt(i, 10)][1]);
        }
    }
    console.log(centerX * centerXSum);
    console.log(centerY * centerYSum);

    console.log(centerYSum);
    console.log(centerYSum);

    const returnObject = {};
    returnObject.x = centerX * centerXSum;
    returnObject.y = centerY * centerYSum;
    returnObject.z = 0.0;

    return returnObject;
}

//Rotate using certain point
// rotatePointObject = {x:1.0, y:1.0. z:0.0}
function rotateByAngle(points, rotatePointObject, angle) {
    const rotateMatrix = [
        [Math.cos(angle), -Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle)],
    ];
    const finalPoints = [];

    for (const i in points) {
        const fPoints = multiplyMatrices(rotateMatrix, [
            [points[i][0] - rotatePointObject.x],
            [points[i][1] - rotatePointObject.y],
        ]);
        const arrayToAdd = [
            parseFloat(fPoints[0][0]) + rotatePointObject.x,
            parseFloat(fPoints[1][0]) + rotatePointObject.y,
        ];

        finalPoints.push(arrayToAdd);
    }
    return finalPoints;
}

//Rotate by center of the shape
function centerRotateByAngle(points, angle) {
    const rotateMatrix = [
        [Math.cos(angle), -Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle)],
    ];
    const shapeCenteroid = getCenter(points, getAreaOf2DPolygon(points));
    const finalPoints = [];

    for (const i in points) {
        const fPoints = multiplyMatrices(rotateMatrix, [
            [points[i][0] - shapeCenteroid.x],
            [points[i][1] - shapeCenteroid.y],
        ]);
        const arrayToAdd = [parseFloat(fPoints[0][0]) + shapeCenteroid.x, parseFloat(fPoints[1][0]) + shapeCenteroid.y];

        finalPoints.push(arrayToAdd);
    }
    return finalPoints;
}

function multiplyMatrices(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        const x = a.length;
        const z = a[0].length;
        const y = b[0].length;

        if (b.length !== z)
            throw new Error(
                'number of columns in the first matrix should be the same as the number of rows in the second',
            );
        else {
            const productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
            const product = new Array(x);
            for (let p = 0; p < x; p++) product[p] = productRow.slice();

            for (let i = 0; i < x; i++) {
                for (let j = 0; j < y; j++) {
                    for (let k = 0; k < z; k++) {
                        product[i][j] += a[i][k] * b[k][j];
                    }
                }
            }
            return product;
        }
    } else throw new Error('Arguments must 2 dimensional arrays.');
}

alt.on('ZoneManager_SyncData', (ZoneObject) => {
    if (!IsZoneRegistered(ZoneObject.zoneName, ZoneObject.dimension)) {
        Registered.push(ZoneObject);
        alt.emit('ZoneManager_OnZoneCreated', Registered.indexOf(ZoneObject));
    } else {
        Registered.forEach((RegisteredZone) => {
            if (ZoneObject.type == RegisteredZone.type) {
                if (ZoneObject.zoneName == RegisteredZone.zoneName) {
                    if (ZoneObject.type == types['2PointZone']) {
                        RegisteredZone.firstvec = ZoneObject.firstvec;
                        RegisteredZone.secondvec = ZoneObject.secondvec;
                        RegisteredZone.data = ZoneObject.data;
                        alt.emit('ZoneManager_OnZoneUpdated', Registered.indexOf(RegisteredZone));
                    } else if (ZoneObject.type == types['4PointZone']) {
                        RegisteredZone.firstvec = ZoneObject.firstvec;
                        RegisteredZone.secondvec = ZoneObject.secondvec;
                        RegisteredZone.thirdvec = ZoneObject.thirdvec;
                        RegisteredZone.forthvec = ZoneObject.forthvec;
                        RegisteredZone.height = ZoneObject.height;
                        RegisteredZone.data = ZoneObject.data;
                        alt.emit('ZoneManager_OnZoneUpdated', Registered.indexOf(RegisteredZone));
                    } else if (ZoneObject.type == types['6PointZone']) {
                        RegisteredZone.firstvec = ZoneObject.firstvec;
                        RegisteredZone.secondvec = ZoneObject.secondvec;
                        RegisteredZone.thirdvec = ZoneObject.thirdvec;
                        RegisteredZone.forthvec = ZoneObject.forthvec;
                        RegisteredZone.fifthvec = ZoneObject.fifthvec;
                        RegisteredZone.sixthvec = ZoneObject.sixthvec;
                        RegisteredZone.height = ZoneObject.height;
                        RegisteredZone.data = ZoneObject.data;
                        alt.emit('ZoneManager_OnZoneUpdated', Registered.indexOf(RegisteredZone));
                    } else if (ZoneObject.type == types['NPointZone']) {
                        RegisteredZone.vectors = ZoneObject.vectors;
                        RegisteredZone.height = ZoneObject.height;
                        RegisteredZone.data = ZoneObject.data;
                        alt.emit('ZoneManager_OnZoneUpdated', Registered.indexOf(RegisteredZone));
                    }
                }
            }
        });
    }
});

alt.on('ZoneManager:IsZoneRegistered', (zoneName, dimension) =>
    alt.emit('ZoneManager:IsZoneRegistered:Callback', IsZoneRegistered(zoneName, dimension)),
);

alt.on('ZoneManager:GetZoneByName', (zoneName, dimension) =>
    alt.emit('ZoneManager:GetZoneByName:Callback', GetZoneByName(zoneName, dimension)),
);
alt.on('ZoneManager:GetZoneByIndex', (zoneIndex) =>
    alt.emit('ZoneManager:GetZoneByIndex:Callback', GetZoneByIndex(zoneIndex)),
);

alt.on('ZoneManager:RegisterZone', (vectors, height, zoneName, type, dimension) =>
    alt.emit('ZoneManager:RegisterZone:Callback', RegisterZone(vectors, height, zoneName, type, dimension)),
);
alt.on('ZoneManager:UnregisterZone', (zoneName, dimension) =>
    alt.emit('ZoneManager:UnregisterZone:Callback', UnregisterZone(zoneName, dimension)),
);

alt.on('ZoneManager:DrawZoneBy2', (startPos, endPos, r, g, b, a) =>
    alt.emit('ZoneManager:DrawZoneBy2:Callback', DrawZoneBy2(startPos, endPos, r, g, b, a)),
);
alt.on('ZoneManager:DrawZoneBy4', (vectors, height, r, g, b, a) =>
    alt.emit('ZoneManager:DrawZoneBy4:Callback', DrawZoneBy4(vectors, height, r, g, b, a)),
);
alt.on('ZoneManager:DrawZoneBy6', (vectors, height, r, g, b, a) =>
    alt.emit('ZoneManager:DrawZoneBy6:Callback', DrawZoneBy6(vectors, height, r, g, b, a)),
);
alt.on('ZoneManager:DrawZoneByN', (vectors, height, r, g, b, a) =>
    alt.emit('ZoneManager:DrawZoneByN:Callback', DrawZoneByN(vectors, height, r, g, b, a)),
);

alt.on('ZoneManager:IsPointInZone', (point, zoneName, dimension) =>
    alt.emit('ZoneManager:IsPointInZone:Callback', IsPointInZone(point, zoneName, dimension)),
);
