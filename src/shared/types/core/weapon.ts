

export interface IWeaponSource {
    modelHash: number;
    recoilShakeAmplitude: number;
    recoilAccuracyMax: number;
    recoilAccuracyToAllowHeadshotPlayer: number;
    recoilRecoveryRate: number;
    animReloadRate: number;
    vehicleReloadTime: number;
    lockOnRange: number;
    accuracySpread: number;
    range: number;
    damage: number;
    headshotDamageModifier: number;
    playerDamageModifier: number;
}