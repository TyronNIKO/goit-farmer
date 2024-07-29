class Garden {
    interFace;
    garden;
    constructor(interFace, playerData) {
        this.interFace = interFace;
        this.playerData = playerData;
    }

    renderGarden() {
        this.interFace.garden.innerHTML = "";
        const gardenMrkp = this.playerData.garden.map(el => {
            return `<li>
                        <div class="bed"
                        data-id="${el.id}"
                        data-status="${el.status}"
                        data-plant="${el.plant}"
                        data-growth="${el.growth}"
                        data-debuff="${el.debuff}"
                        >${el.status}
                        </div>
                    </li>`;
        });
        this.interFace.garden.insertAdjacentHTML("beforeend", gardenMrkp.join(""));
    }
}
export default Garden;
