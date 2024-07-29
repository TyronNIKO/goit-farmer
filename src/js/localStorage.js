const LS = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    load(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    reset(key) {
        localStorage.removeItem(key);
    },
};

export default LS;
