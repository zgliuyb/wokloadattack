onmessage = async function (e) {
    let debug = true

    /**
     * Waiting for ms
     * @param ms
     * @returns {Promise<unknown>}
     */
    function waiting(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Running for
     * @param ms
     */
    function running(ms) {
        let start = new Date().getTime();
        let end = start;
        while (end < start + ms) {
            end = new Date().getTime();
            const primes = calculatePrimes(iterations, multiplier);
        }
    }

    /**
     *
     * @param iterations
     * @param multiplier
     * @returns {[]}
     */
    function calculatePrimes(iterations, multiplier) {
        let start = new Date().getTime();
        const primes = [];
        for (let i = 0; i < iterations; i++) {
            const candidate = i * (multiplier * Math.random());
            let isPrime = true;
            for (let c = 2; c <= Math.sqrt(candidate); ++c) {
                if (candidate % c === 0) {
                    // not prime
                    isPrime = false;
                    break;
                }
            }
            if (isPrime) {
                primes.push(candidate);
            }
        }
        const end = new Date().getTime();
        if (debug) {
            console.warn("Cost " + (end - start) + "ms")
        }
        return primes;
    }

    /**
     *
     * @returns {string}
     */
    function getCurTime() {
        let startTime = new Date().toLocaleString()
        return startTime;
    }

    console.log('Message received from main script');
    let workerResult = [];

    let canStart = e.data[0]
    if (canStart === "true") {
        seq = e.data[1],
            high_level = e.data[2],
            low_level = e.data[3],
            iterations = e.data[4],
            multiplier = e.data[5],
            finalOut = e.data[6],
            other = e.data[7];

        for (let i = 0; i < seq.length; i++) {
            if (seq[i] === '1') {
                let startTime = getCurTime();
                running(high_level * 1000, iterations, multiplier);
                let endTime = getCurTime();
                workerResult.push([startTime, endTime, 1])
            } else {
                let startTime = getCurTime();
                await waiting(low_level * 1000).then(r => {
                    let endTime = getCurTime()
                    workerResult.push([startTime, endTime, 0])
                });
            }
        }
        console.log('Posting message back to main script');
        postMessage(workerResult);
    } else {
        console.log('Waiting for message arriving at');
    }
};