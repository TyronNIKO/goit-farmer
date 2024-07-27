const level = document.querySelector("#level .value");
const experience = document.querySelector(".experience .value");
const experienceLine = document.querySelector(".experience .line");
const money = document.querySelector("#money .value");
const harvest = document.querySelector("#harvest .value");
const garden = document.querySelector("#garden");
const seeds = document.querySelector("#seeds");
const items = document.querySelector("#items");
let seedsArr, itemsArr;
const buyGarden = document.querySelector("[data-action=buy-garden]");
const sellHarvest = document.querySelector("[data-action=sell-harvest]");
let activeItem = "";

const baseBed = {id: 0, status: 0, plant: "", growth: 0, debuff: 0, baseValue: 100, quality: 0};
const nextLevel = {
    2: 1000,
    3: 1100,
};
const player = JSON.parse(localStorage.getItem("player")) || {
    id: 0,
    level: 1,
    experience: 50,
    money: 0,
    harvest: 0,
    garden: [baseBed],
    seeds: [{name: "Carrot", value: 0.1, growRate: 1}],
    items: [{name: "Sapka", used: 100}],
};

function init() {
    console.log(player);

    money.textContent = player.money;
    harvest.textContent = player.harvest;

    renderGarden();
    level.textContent = player.level;

    experience.textContent = player.experience;
    experienceLine.style.width = (player.experience * 100) / nextLevel[2] + "%";

    const seedsMrkp = player.seeds.map(el => {
        return `<button type="button" class="" data-seed="${el.name}">${el.name}</button>`;
    });
    seeds.insertAdjacentHTML("beforeend", seedsMrkp.join(""));
    seedsArr = document.querySelectorAll("[data-seed]");

    const itemsMrkp = player.items.map(el => {
        return `<button type="button" class="" data-item="${el.name}">${el.name}</button>`;
    });
    items.insertAdjacentHTML("beforeend", itemsMrkp.join(""));
    itemsArr = document.querySelectorAll("[data-item]");
}
init();

function renderGarden() {
    garden.innerHTML = "";
    const gardenMrkp = player.garden.map(el => {
        return `<li
        data-id="${el.id}"
        data-status="${el.status}"
        data-plant="${el.plant}"
        data-growth="${el.growth}"
        data-debuff="${el.debuff}"
        >${el.status}</li>`;
    });
    garden.insertAdjacentHTML("beforeend", gardenMrkp.join(""));
}

function setActiveClass(evt) {
    evt.preventDefault();
    console.log(evt);

    const parent = evt.target.parentElement;
    const sibling = parent.querySelector(".active");

    if (sibling && sibling !== evt.target) {
        console.log("true");
        sibling.classList.remove("active");
    }

    if (evt.target.classList.contains("active")) {
        console.log("true");
        evt.target.classList.remove("active");
    } else {
        console.log("false");
        evt.target.classList.add("active");
    }
    console.log(evt.target.dataset);
    const keys = Object.keys(evt.target.dataset);
    let key = "";
    switch (keys[0]) {
        case "seed":
            console.log("seed");
            key = "seed";
            break;
        case "item":
            console.log("item");
            key = "item";
            break;
        default:
            break;
    }
    activeItem = evt.target.dataset[key];

    console.log(activeItem);
}

itemsArr.forEach(item => {
    item.addEventListener("click", setActiveClass);
});
seedsArr.forEach(item => {
    item.addEventListener("click", setActiveClass);
});

buyGarden.addEventListener("click", e => {
    e.preventDefault();
    console.log(e.target);
    console.log(player.garden);
    const index = player.garden.length - 1;
    console.log(index);

    const baseValue = player.garden[index].baseValue;

    const coeff = 2;
    const value = baseValue * coeff;

    console.log(value);
    try {
        subtractMoney(value);
        player.garden.push({...baseBed, baseValue: value, id: player.garden.length});
        console.log(player.garden);

        renderGarden();
    } catch (error) {
        console.log(error);
    }

    //винести блокування на рівень початкового рендеру
    // if (value * 2 > player.money) {
    //     e.target.disabled = true;
    // }
    localStorage.setItem("player", JSON.stringify(player));
});

garden.addEventListener("click", e => {
    if (e.target === e.currentTarget) return;
    console.log(e.target.dataset, activeItem);
    activeItem = activeItem.toLowerCase();
    // e.target.dataset.plant = activeItem;

    // console.log(player.garden.find(item => item.id == e.target.dataset.id));
    let harvest = player.garden.find(item => item.id == e.target.dataset.id);
    console.log("harvest", harvest);

    // player.garden[e.target.dataset.id] = harvest.plant;
    harvest.plant = activeItem;
    console.log((harvest.plant = activeItem));

    updateGardenStatus(e);
    collectHarvest(e);
    localStorage.setItem("player", JSON.stringify(player));
    renderGarden();
});
function collectHarvest(e) {
    // console.log(e.target.dataset);

    const harvest = {
        name: e.target.dataset.plant,
        value: 0.5,
        price: 10,
    };
    // console.log(harvest);
}
function updateGardenStatus(e) {
    if (activeItem == "sapka") {
        e.target.dataset.status = 1;
        e.target.innerText = e.target.dataset.status;
    }
    if (activeItem == "fertiler") {
        if (+e.target.dataset.status < 2) {
            e.target.innerText = ++e.target.dataset.status;
        } else {
            alert("Рівень грядки не зоволяє використати добриво");
        }
    }
    if (activeItem == "liyka") {
        if (+e.target.dataset.status > 0 && +e.target.dataset.status < 3) {
            e.target.innerText = ++e.target.dataset.status;
        } else {
            alert("Рівень грядки не зоволяє використати лійку");
        }
    }
    if (activeItem == "lopata") {
        if (+e.target.dataset.status == 3) {
            e.target.dataset.status = 0;
            e.target.innerText = e.target.dataset.status;
            harvest.innerText = harvest.innerText * 1 + 0.1;
        } else {
            alert("Врожай не дозрів");
        }
    }
}
function addMoney(value) {
    console.log(value);
    // console.log(player.money);
    let currentValue = player.money;
    player.money = currentValue + value;
    money.textContent = player.money;
    console.log(localStorage);
    localStorage.setItem("player", JSON.stringify(player));
}
function subtractMoney(value) {
    console.log(value);
    console.log(player.money);
    let currentValue = player.money;
    let currentMoney = currentValue - value;
    if (isEnoughMoney(currentMoney)) {
        player.money = currentMoney;
        money.textContent = player.money;
        console.log(localStorage);
        localStorage.setItem("player", JSON.stringify(player));
    } else {
        alert(`Не вистачає грошей на рахунку ${currentMoney * -1} грн`);
        throw new Error("no money");
    }
}
function isEnoughMoney(currentValue) {
    return currentValue >= 0;
}
sellHarvest.addEventListener("click", () => {
    addMoney(1100);
});
