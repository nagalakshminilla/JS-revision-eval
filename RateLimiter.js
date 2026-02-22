function createRateLimiter(limit, interval) {
    let callCount = 0;
    let resetTimer = null;
    
    function resetCounter() {
        callCount = 0;
    }
    
    resetTimer = setInterval(resetCounter, interval);
    
    // Return the limiter function
    return function(fn, ...args) {
        // Check if under limit
        if (callCount < limit) {
            callCount++;
            return {
                allowed: true,
                result: fn(...args),
                remaining: limit - callCount
            };
        } else {
            return {
                allowed: false,
                error: `Rate limit exceeded. Maximum ${limit} calls per ${interval}ms`,
                remaining: 0
            };
        }
    };
}

function createRateLimitedFunction(fn, limit, interval) {
    const limiter = createRateLimiter(limit, interval);
    
    return function(...args) {
        return limiter(fn, ...args);
    };
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createRateLimiter, createRateLimitedFunction };
}