async function runSequential(tasks, delay) {
    // Input validation
    if (!Array.isArray(tasks)) {
        throw new Error('Tasks must be an array');
    }
    if (typeof delay !== 'number' || delay < 0) {
        throw new Error('Delay must be a positive number');
    }
    
    const results = [];
    
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        
        try {
            // Execute current task
            console.log(`Executing task ${i + 1}/${tasks.length}...`);
            const result = await task();
            results.push(result);
            
            // Wait for delay before next task (except last task)
            if (i < tasks.length - 1) {
                console.log(`Waiting ${delay}ms before next task...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (error) {
            // Stop execution and throw error
            console.error(`Task ${i + 1} failed:`, error);
            throw new Error(`Task execution stopped at task ${i + 1}: ${error.message}`);
        }
    }
    
    console.log('All tasks completed successfully');
    return results;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = runSequential;
}