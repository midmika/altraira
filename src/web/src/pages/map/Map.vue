<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import {
    LMap,
    LTileLayer,
    LCircleMarker,
    LLayerGroup,
    LMarker,
    LPopup,
    LIcon,
    LPolygon,
    LTooltip,
} from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import { onBeforeMount, onBeforeUnmount, Ref, ref } from 'vue';
import { IVector3 } from '@/types.ts';
import { IZoneDto } from '@/shared/app/zone/AbstractZone.ts';

const { isOpen } = defineProps<{ isOpen: boolean }>();

const center_x = 117.3;
const center_y = 172.8;
const scale_x = 0.02072;
const scale_y = 0.0205;

const CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    scale: function (zoom: number) {
        return Math.pow(2, zoom);
    },
    zoom: function (sc: number) {
        return Math.log(sc) / 0.6931471805599453;
    },
    distance: function (pos1: { lng: number; lat: number }, pos2: { lng: number; lat: number }) {
        const x_difference = pos2.lng - pos1.lng;
        const y_difference = pos2.lat - pos1.lat;
        return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
    },
    transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
    infinite: true,
});

const onAddNavigationPoint = (pos: IVector3) => {
    alt.emit('map:set_nav_point', pos);
};

const zoneList: Ref<IZoneDto[]> = ref([]);

const addZone = (zone: IZoneDto) => {
    zoneList.value.push(zone);
};

const updateZone = (zone: IZoneDto) => {
    zoneList.value = zoneList.value.map((i) => {
        if (i.id === zone.id) return zone;
        return i;
    });
};

const removeZone = (zone: IZoneDto) => {
    zoneList.value = zoneList.value.filter((_zone) => zone.id !== zone.id);
};

onBeforeMount(() => {
    alt.on('map:add_zone', addZone);
    alt.on('map:update_zone', updateZone);
    alt.on('map:remove_zone', removeZone);
});

onBeforeUnmount(() => {
    alt.off('map:add_zone', addZone);
    alt.off('map:update_zone', updateZone);
    alt.off('map:remove_zone', removeZone);
});
</script>

<template>
    <div class="map" v-if="isOpen">
        <l-map
            class="map-inner"
            ref="map"
            :crs="CUSTOM_CRS"
            :min-zoom="3"
            :max-zoom="5"
            :zoom="3"
            :max-native-zoom="5"
            :center="[0, 0]"
            :bounds="L.latLngBounds([-4051, -5640], [8407, 6690])"
            :max-bounds="L.latLngBounds([-4051, -5640], [8407, 6690])"
            :max-bounds-viscosity="1"
            :zoom-control="false"
        >
            <l-tile-layer
                url="/map2/{z}/{x}/{y}.jpg"
                :no-wrap="true"
                :continuous-world="false"
                attribution="Online map GTA V"
            />

            <l-layer-group>
                <LPolygon v-for="zone of zoneList" :lat-lngs="zone.polygon.map((i) => [i.y, i.x])">
                    <LTooltip :style="{ fontSize: '20rem' }">
                        <div class="popup">
                            <div class="popup-head">
                                <span>{{ zone.name }}</span>
                            </div>
                            <span>Под контролем 4 часа 43 минуты</span>
                        </div>
                    </LTooltip>
                </LPolygon>
            </l-layer-group>
            <!--            <l-layer-group>-->
            <!--                <l-marker v-for="gate in gateList" :lat-lng="[gate.pos.y, gate.pos.x]" :key="gate.name">-->
            <!--                    <l-popup>-->
            <!--                        <div class="popup">-->
            <!--                            <div class="popup-head">-->
            <!--                                <img src="/icons/map/borteli.png" alt="" />-->
            <!--                                <span>{{ gate.name }}</span>-->
            <!--                            </div>-->

            <!--                            <div class="popup-prices" v-if="gate.buyPrice !== null && gate.sellPrice !== null">-->
            <!--                                <span>Цена покупки: ${{ format$(gate.buyPrice) }}/кг</span>-->
            <!--                                <span>Цена продажи: ${{ format$(gate.sellPrice) }}/кг</span>-->
            <!--                            </div>-->

            <!--                            <div class="popup-prices" v-else>-->
            <!--                                <span>Торги приостановлены</span>-->
            <!--                            </div>-->

            <!--                            <button @click="onAddNavigationPoint(gate.pos)">Установить точку</button>-->
            <!--                        </div>-->
            <!--                    </l-popup>-->
            <!--                    <l-icon icon-url="/icons/map_point.svg" :icon-size="36" />-->
            <!--                </l-marker>-->
            <!--            </l-layer-group>-->
        </l-map>
    </div>
</template>

<style scoped lang="scss">
.map {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1200rem;
    height: 800rem;
    display: flex;
    background: #171717;
    padding: 6rem 8rem;
    border-radius: 10rem;
    z-index: 1000;
    &-inner {
        border-radius: 16rem;
    }
}
.popup {
    font-size: 14rem;
    color: white;
    display: flex;
    flex-direction: column;
    min-width: 240rem;
    &-head {
        padding: 6rem;
        position: relative;
        overflow: hidden;
        height: 50rem;
        img {
            position: absolute;
            width: 100%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 9;
        }
        span {
            font-size: 20rem;
            color: rgb(255, 255, 255);
            z-index: 10;
            position: absolute;
            left: 10rem;
            top: 10rem;
            width: fit-content;
            text-shadow:
                2px 0 #000,
                -2px 0 #000,
                0 2px #000,
                0 -2px #000,
                1px 1px #000,
                -1px -1px #000,
                1px -1px #000,
                -1px 1px #000;
        }
    }
    &-prices {
        padding: 6rem;
        display: flex;
        flex-direction: column;
    }
    button {
        margin: 0 6rem 6rem 6rem;
        padding: 4rem 6rem;
        border-radius: 4rem;
        background: transparent;
        color: white;
        border: 1px solid white;
        transition: 150ms all ease;
        cursor: pointer;
        &:hover {
            background: white;
            border: 1px solid black;
            color: black;
        }
    }
}
</style>
<style lang="scss">
.leaflet-popup-content-wrapper {
    background: #171717;
    overflow: hidden;
    margin: 0;
}
.leaflet-popup-close-button {
    display: none;
}
.leaflet-popup-tip {
    background: #171717;
}
.leaflet-popup-content {
    margin: 0;
    overflow: hidden;
}
.leaflet-tooltip {
    font-size: 20rem;
    background: black;
    color: white;
    border: 1px solid rgba(black, 0.7);
    transition: opacity 200ms ease-in-out;
}
.leaflet-tooltip-left:before {
    border-left-color: black !important;
}
.leaflet-tooltip-right:before {
    border-right-color: black !important;
}
.leaflet-interactive {
    outline: none;
}
</style>
