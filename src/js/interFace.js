const interFace = {
    level: document.querySelector("#level .value"),
    experience: document.querySelector(".experience .value"),
    experienceLine: document.querySelector(".experience .line"),
    money: document.querySelector("#money .value"),
    harvest: document.querySelector("#harvest .value"),
    garden: document.querySelector("#garden"),
    seeds: document.querySelector("#seeds"),
    items: document.querySelector("#items"),
    time: document.querySelector(".time"),
};
export const buttons = {
    reset: document.querySelector("[data-action=reset-local-storage]"),
    buyGarden: document.querySelector("[data-action=buy-garden]"),
    sellHarvest: document.querySelector("[data-action=sell-harvest]"),
};
export default interFace;
