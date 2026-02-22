function createCountdown(seconds, onTick, onComplete) {
    let remainingSeconds = seconds;
    let isRunning = false;
    let isPaused = false;
    let startTime = null;
    let pauseTime = null;
    let timerId = null;
    let expectedNextTick = null;
    function tick() {
        if (!isRunning || isPaused) return;
        const now = Date.now();
        if (expectedNextTick) {
            const drift = now - expectedNextTick;
            if (Math.abs(drift) > 100) {
                console.log(`Drift detected: ${drift}ms`);
            }
        }
        onTick(remainingSeconds);
        remainingSeconds--;
        if (remainingSeconds < 0) {
            stop();
            onComplete();
            return;
        }
        const theoreticalTickTime = expectedNextTick || now;
        expectedNextTick = theoreticalTickTime + 1000;
        const nextDelay = Math.max(0, expectedNextTick - Date.now());
        timerId = setTimeout(tick, nextDelay);
    }
    function stop() {
        isRunning = false;
        isPaused = false;
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
        startTime = null;
        pauseTime = null;
        expectedNextTick = null;
    }
    isRunning = true;
    startTime = Date.now();
    expectedNextTick = startTime + 1000;
    timerId = setTimeout(tick, 1000);
    
    return {
        pause() {
            if (!isRunning || isPaused) return false;
            isPaused = true;
            pauseTime = Date.now();
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
            
            return true;
        },
        resume() {
            if (!isRunning || !isPaused) return false;
            isPaused = false;
            const pauseDuration = Date.now() - pauseTime;
            if (expectedNextTick) {
                expectedNextTick += pauseDuration;
            }
            if (remainingSeconds >= 0) {
                const nextDelay = expectedNextTick ? 
                    Math.max(0, expectedNextTick - Date.now()) : 1000;
                timerId = setTimeout(tick, nextDelay);
            }
            
            return true;
        },
        
        getRemainingSeconds() {
            return remainingSeconds;
        },
        
        getState() {
            if (!isRunning) return 'completed';
            if (isPaused) return 'paused';
            return 'running';
        }
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = createCountdown;
}
