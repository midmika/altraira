<script setup lang="ts">
import { VueDd } from 'vue-dd';
import { onBeforeMount, onBeforeUnmount, ref, Ref } from 'vue';
// import { IVolosLog } from '@/shared/volos.ts';

const logs: Ref<any[]> = ref<any[]>([]);
const isShow: Ref<boolean> = ref<boolean>(false);

const executionTime = (start: number, end: number): string | unknown => {
    return Number((end - start).toFixed(2)) + 'ms';
};

const onAdd = (item: any): void => {
    const newArray = logs.value;
    newArray.push(item);
    logs.value = newArray;
};

const onUpdate = (item: Partial<any>): void => {
    const newArray = logs.value;
    const targetIndex = newArray.findIndex((_item) => item.id === _item.id);
    if (targetIndex === -1) return;
    const oldObject = newArray[targetIndex];
    newArray[targetIndex] = { ...oldObject, ...item };
    logs.value = newArray;
};

const toggleOpen = (val: boolean) => {
    isShow.value = val;
};

onBeforeMount(() => {
    alt.on('Volos:ToggleOpen', toggleOpen);
    alt.on('Volos:Add', onAdd);
    alt.on('Volos:Update', onUpdate);
});

onBeforeUnmount(() => {
    alt.off('Volos:ToggleOpen', toggleOpen);
    alt.off('Volos:Add', onAdd);
    alt.off('Volos:Update', onUpdate);
});
</script>

<template>
    <div class="log" v-if="isShow">
        <div class="log-item" v-for="log in logs" :key="log.id" :class="[log.type, log.status]">
            <div class="log-item-content">
                <span class="log-item__tag">#{{ log.id }}</span>
                <span class="log-item__time">{{ new Date(log.start_time).toLocaleTimeString() }}</span>
                <template v-if="log.type === 'call'">
                    <span
                        class="log-item__tag bold"
                        :class="[log.destination === 'server_to_client' ? 'client' : 'server']"
                        >{{ log.destination === 'server_to_client' ? 'Incoming' : 'Outgoing' }}</span
                    >
                </template>

                <template v-if="log.type === 'reply'">
                    <span
                        class="log-item__tag bold"
                        :class="[log.destination === 'server_to_client' ? 'client' : 'server']"
                    >
                        {{ log.destination === 'server_to_client' ? 'Incoming' : 'Outgoing' }}
                    </span>
                </template>
            </div>

            <div class="log-item-content json">
                <span class="log-item__tag bordered pointer">{{ log.name }}</span>
                <VueDd
                    class="log-item-json"
                    v-model="log.payload"
                    font-size="12rem"
                    line-height="14rem"
                    padding-left="14rem"
                />
            </div>

            <div v-if="log.type === 'reply'" class="log-item-content reply">
                <span v-if="log.end_time" class="log-item__tag bordered">{{
                    executionTime(log.start_time, log.end_time)
                }}</span>
                <VueDd
                    v-if="log.response"
                    class="log-item-json"
                    v-model="log.response.data"
                    font-size="12rem"
                    line-height="14rem"
                    padding-left="14rem"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.log {
    display: flex;
    flex-direction: column-reverse;
    position: absolute;
    left: 0;
    top: 0;
    width: max(50vw, 600rem);
    height: calc(100vh - 12rem);
    background-color: rgba(24, 24, 24, 0.95);
    overflow-y: scroll;
    z-index: 99999999999999;
    padding: 6rem 0;
    user-select: auto;
    &-item {
        display: flex;
        border: 6rem;
        gap: 6rem;
        font-size: 12rem;
        color: white;
        padding: 4rem 6rem;
        background-size: 1em 1em;
        height: fit-content;

        &.success {
            background: repeating-linear-gradient(
                135deg,
                rgba(0, 255, 0, 0.1) 0,
                rgba(0, 255, 0, 0.1) 10%,
                transparent 0,
                transparent 50%
            );
            background-size: 1em 1em;
        }

        &.failed {
            background: repeating-linear-gradient(
                135deg,
                rgba(255, 0, 0, 0.1) 0,
                rgba(255, 0, 0, 0.1) 10%,
                transparent 0,
                transparent 50%
            );
            background-size: 1em 1em;
        }

        &.inprogress {
            background: repeating-linear-gradient(
                135deg,
                rgba(0, 0, 255, 0.1) 0,
                rgba(0, 0, 255, 0.1) 10%,
                transparent 0,
                transparent 50%
            );
            background-size: 1em 1em;
        }

        &-content {
            align-self: start;
            align-items: center;
            display: flex;
            gap: 6rem;
            text-align: start;
            &.json {
                align-items: start;
            }
            &.reply {
                align-items: start;
            }
        }
        &-json {
            height: fit-content;
            align-self: center;
        }
        &__tag {
            padding: 4rem 6rem;
            border-radius: 4rem;
            height: fit-content;
            width: fit-content;

            border: 2px solid transparent;

            &.bordered {
                border: 2px solid #808080;
            }

            &.bold {
                font-weight: 700;
            }

            &.pointer {
                cursor: pointer;
            }

            &.client {
                background: rgba(230, 2, 238, 0.5);
            }
            &.server {
                background: rgba(11, 108, 161, 0.5);
            }

            &.success {
                border-color: green !important;
            }

            &.failed {
                border-color: red !important;
            }

            &.inprogress {
                border-color: orange;
            }
        }
        &__time {
            height: fit-content;
        }
    }
}
</style>
