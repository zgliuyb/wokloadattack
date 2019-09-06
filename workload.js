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

function running(ms, iterations, multiplier) {
    let start = new Date().getTime();
    let end = start;
    while (end < start + ms) {
        end = new Date().getTime();
        const primes = calculatePrimes(iterations, multiplier);
    }
}

function waiting(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 *
 * @returns {string}
 */
function getCurTime() {
    let startTime = new Date().toLocaleString()
    return startTime;
}

onmessage = function (e) {
    console.log('Message received from main script');
    let workerResult = 'Result';

    let seq = e.data[0],
        high_level = e.data[1],
        low_level = e.data[2],
        iterations = e.data[3],
        multiplier = e.data[4],
        finalOut = e.data[5],
        other = e.data[6];
    let out = [];
    for (let i = 0; i < seq.length; i++) {
        if (seq[i] === '1') {
            let startTime = getCurTime();
            running(high_level * 1000, iterations, multiplier);
            let endTime = getCurTime();
            out.push([startTime, endTime, 1])
        } else {
            let startTime = getCurTime();
            Promise.resolve().then(() => {
                waiting(low_level * 1000);
            }).then(() => {
                let endTime = getCurTime()
                out.push([startTime, endTime, 0])
            })
        }
    }
    console.log('Posting message back to main script');
    postMessage(workerResult);
}