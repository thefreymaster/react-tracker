export const generateKey = () => {
    const key = Math.floor(1000 + Math.random() * 9000)
    return key;
}