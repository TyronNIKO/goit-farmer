import LS from "./src/js/localStorage.js";
import interFace, {buttons} from "./src/js/interFace.js";
import Garden from "./src/js/Garden.js";

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return {days, hours, minutes, seconds};
}
let date = new Date();
console.log(date);

setInterval(() => {
    let date = new Date();
    let dateOff = date.getTime() - date.getTimezoneOffset() * 60 * 1000;

    let currentDate = convertMs(dateOff);
    interFace.time.textContent = `${currentDate.hours}:${currentDate.minutes}:${currentDate.seconds}`;
}, 1000);

let seedsArr, itemsArr;
const activeItem = {
    name: "",
    type: "",
};

const baseBed = {id: 0, status: 0, plant: "", growth: 0, debuff: 0, baseValue: 100, quality: 0};
const nextLevelRequirements = {
    2: 1000,
    3: 1100,
};
// const player = LS.load("player") || {
//     id: 0,
//     level: 1,
//     experience: 50,
//     money: 0,
//     harvest: 0,
//     garden: [baseBed],
//     seeds: [{name: "Carrot", value: 0.1, growRate: 1}],
//     items: [{name: "Sapka", used: 100}],
// };

class Player {
    data;
    default = {
        id: 0,
        level: 1,
        experience: 50,
        money: 0,
        harvest: 0,
        garden: [baseBed],
        seeds: [{name: "Carrot", value: 0.1, growRate: 1}],
        items: [{name: "Sapka", used: 100}],
    };
    constructor(data) {
        this.data = data || this.default;
    }
    addMoney(value) {
        console.log(value);
        this.data.money = this.data.money + value;
    }
    subtractMoney(value) {
        console.log(value);
        if (this.isEnoughMoney(this.data.money - value)) {
            this.data.money = this.data.money - value;
        } else {
            alert(`Не вистачає грошей на рахунку ${this.data.money - value} грн`);
            throw new Error("no money");
        }
    }
    isEnoughMoney(currentValue) {
        return currentValue >= 0;
    }
}

const player = new Player(LS.load("player"));

const garden = new Garden(interFace, player.data);

const render = {
    money() {
        interFace.money.textContent = "";
        interFace.money.textContent = player.data.money;
    },
    harvest() {
        interFace.harvest.textContent = "";
        interFace.harvest.textContent = player.data.harvest;
    },
    level() {
        interFace.level.textContent = "";
        interFace.level.textContent = player.data.level;
        interFace.experience.textContent = "";
        interFace.experience.textContent = player.data.experience;
        interFace.experienceLine.style.width = (player.data.experience * 100) / nextLevelRequirements[2] + "%";
    },
};
function init() {
    console.log(player.data);

    render.money();
    render.harvest();

    garden.renderGarden();
    render.level();

    const seedsMrkp = player.data.seeds.map(el => {
        return `<button type="button" class="" data-seed="${el.name}">${el.name}</button>`;
    });
    interFace.seeds.insertAdjacentHTML("beforeend", seedsMrkp.join(""));
    seedsArr = document.querySelectorAll("[data-seed]");

    const itemsMrkp = player.data.items.map(el => {
        return `<button type="button" class="" data-item="${el.name}">${el.name}</button>`;
    });
    interFace.items.insertAdjacentHTML("beforeend", itemsMrkp.join(""));
    itemsArr = document.querySelectorAll("[data-item]");
}
init();

function setActiveClass(evt) {
    evt.preventDefault();
    // console.log(evt);

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
    activeItem.name = evt.target.dataset[key].toLowerCase();
    activeItem.type = keys[0];

    console.log(activeItem);
}

itemsArr.forEach(item => {
    item.addEventListener("click", setActiveClass);
});
seedsArr.forEach(item => {
    item.addEventListener("click", setActiveClass);
});

buttons.buyGarden.addEventListener("click", e => {
    e.preventDefault();
    console.log(e.target);
    console.log(player.data.garden);
    const index = player.data.garden.length - 1;
    console.log(index);

    const baseValue = player.data.garden[index].baseValue;

    const coeff = 2;
    const value = baseValue * coeff;

    console.log(value);
    try {
        player.subtractMoney(value);
        render.money();
        player.data.garden.push({...baseBed, baseValue: value, id: player.data.garden.length});
        console.log(player.data.garden);
        garden.renderGarden();
        LS.save("player", player.data);
    } catch (error) {
        console.log(error);
    }

    //винести блокування на рівень початкового рендеру
    // if (value * 2 > player.data.money) {
    //     e.target.disabled = true;
    // }
});
buttons.sellHarvest.addEventListener("click", () => {
    player.addMoney(1100);
    LS.save("player", player.data);
    render.money();
});

interFace.garden.addEventListener("click", e => {
    if (e.target === e.currentTarget) return;
    console.log(e.target.dataset, activeItem);

    // e.target.dataset.plant = activeItem;

    // console.log(player.garden.find(item => item.id == e.target.dataset.id));
    let harvest = player.data.garden.find(item => item.id == e.target.dataset.id);
    console.log("harvest", harvest);

    if (!harvest.plant) {
        console.log("harvest.plant empty");
        if (activeItem.type === "seed") {
            harvest.plant = activeItem.name;
        }
    }
    if (harvest.growth === 100) {
        console.log("harvest.growth = 100");
        collectHarvest(e);
    }

    console.log("harvest", harvest);

    updateGardenStatus(e);

    LS.save("player", player.data);
    garden.renderGarden();
});

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
function collectHarvest(e) {
    console.log("collectHarvest");

    const harvest = {
        name: e.target.dataset.plant,
        value: 0.5,
        price: 10,
    };
    // console.log(harvest);
}
buttons.reset.addEventListener("click", e => {
    LS.reset("player");
    console.log("Local storage cleared");
    init();
});
