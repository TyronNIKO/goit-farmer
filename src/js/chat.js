import LS from "./localStorage";
import {convertMsToTime, formatTime} from "./Time";

const chatRefs = {
    messages: document.querySelector(".chat__messages"),
    inputMsg: document.querySelector(".chat__input-field[name=message]"),
    inputName: document.querySelector(".chat__input-field[name=name]"),
    button: document.querySelector(".chat__input-button"),
};
const chatUpdate = () => {
    const data = LS.load("chat");
    console.log(data);

    if (!data) return;

    const msgs = data.map(el => {
        let user = "";
        switch (el.user.toLowerCase()) {
            case "vova":
                user = "user";
                break;
            case "alina":
                user = "admin";
                break;

            default:
                break;
        }
        return `<div class="msg ${user}">
                    <div class="content">
                        <p>${el.msg}</p>
                    </div>
                    <div class="info">
                        <p>${el.time}</p>
                        <p>${el.user}</p>
                    </div>
                </div>`;
    });

    chatRefs.messages.innerHTML = msgs.join("");
};

const chatInit = () => {
    chatRefs.button.addEventListener("click", e => {
        e.preventDefault();
        console.log(chatRefs.inputMsg.value);
        const dataOld = LS.load("chat");
        console.log(typeof dataOld, Boolean(dataOld));

        // const array = dataOld ?? [];
        const array = dataOld ? [...dataOld] : [];

        console.log(typeof array);

        const data = {
            user: chatRefs.inputName.value,
            msg: chatRefs.inputMsg.value,
            time: formatTime(convertMsToTime()),
        };
        array.push(data);
        LS.save("chat", array);
        chatUpdate();
    });
    // setInterval(() => {
    //     chatUpdate();
    // }, 5000);
    chatUpdate();
};

export default chatInit;
