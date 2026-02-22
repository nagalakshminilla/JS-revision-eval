const timerStorage = new Map();
let nextId = 1;

function mySetInterval(callback, delay) {
    // Validate inputs
    if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
    }
    if (typeof delay !== 'number' || delay < 0) {
        throw new Error('Delay must be a positive number');
    }
    
    const id = nextId++;
    function scheduleNext() {
        const timeoutId = setTimeout(() => {
            callback();
            if (timerStorage.has(id)) {
                scheduleNext();
            }
        }, delay);
        
        if (timerStorage.has(id)) {
            timerStorage.set(id, timeoutId);
        }
    }
    const initialTimeoutId = setTimeout(() => {
        callback();
        scheduleNext();
    }, delay);
    timerStorage.set(id, initialTimeoutId);
    
    return id;
}

function myClearInterval(id) {
    if (timerStorage.has(id)) {
        const timeoutId = timerStorage.get(id);
        clearTimeout(timeoutId);
        timerStorage.delete(id);
        return true;
    }
    return false;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mySetInterval, myClearInterval };
}