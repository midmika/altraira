import type alt from 'alt-client';

export const waitBaseObject = (entity: alt.BaseObject) => {
    return new Promise((resolve, reject) => {
        let tries = 1000;
        const interval = setInterval(() => {
            if (entity.valid) {
                clearInterval(interval);
                resolve(undefined);
            } else {
                tries -= 1;
                if (tries === 0) {
                    clearInterval(interval);
                    reject(`Failed to load entity type <${entity.type}>`);
                }
            }
        }, 1);
    });
};
