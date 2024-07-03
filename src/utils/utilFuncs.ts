export const getRandomArray = (length:number) => {
    const passedIds : number[] = [];
    const getNumber = () => Math.floor(Math.random() * length);
    const tryNumber = () => {
        const randomNumb = getNumber();
        if (!passedIds.includes(randomNumb)) {
            passedIds.push(randomNumb);
            //console.log(passedIds);
        } else {
            tryNumber();
        }
    }

    for (let i = 1; i <= length; i++) {
        tryNumber();
    }
    return passedIds;
}