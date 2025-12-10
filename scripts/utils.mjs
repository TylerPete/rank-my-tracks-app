//a utility function module

//General helper functions (e.g., formatting strings, logging, shuffle arrays).

export function getArrayBatches(array, numElements) {
    let startBatchIndex = 0;
    const arraysArray = [];

    while (startBatchIndex < array.length) {
        const thisBatch = array.slice(startBatchIndex, startBatchIndex + numElements);

        arraysArray.push(thisBatch);

        startBatchIndex += numElements;
    }

    return arraysArray;
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function shuffleArray(array) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        const temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }

    return array;
}

export function showLoader() {
    const loader = document.querySelector(".loader");
    loader.classList.add("loading");
}

export function hideLoader() {
    const loader = document.querySelector(".loader");
    loader.classList.remove("loading");
}

export function changeInstructionsMessage(instructionsString) {
    const instructions = document.querySelector("#instructionsMessage");
    instructions.textContent = instructionsString;
}