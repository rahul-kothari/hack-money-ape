export const promiseTimeout = (time: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}