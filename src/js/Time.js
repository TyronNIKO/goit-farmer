import interFace from "./interFace";

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

export const convertMsToTime = () => {
    let date = new Date();
    let dateOff = date.getTime() - date.getTimezoneOffset() * 60 * 1000;
    let currentDate = convertMs(dateOff);
    return currentDate;
};
export const formatTime = ({hours, minutes, seconds}) => {
    const newDate = {hours: String(hours).padStart(2, "0"), minutes: String(minutes).padStart(2, "0"), seconds: String(seconds).padStart(2, "0")};
    const time = `${newDate.hours}:${newDate.minutes}:${newDate.seconds}`;
    return time;
};
const setTimer = () => {
    setInterval(() => {
        let newDate = formatTime(convertMsToTime());
        interFace.time.textContent = newDate;
    }, 1000);
};

export default setTimer;
