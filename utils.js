//==============================================
/**
 * Waiting for ms
 * @param ms
 * @returns {Promise<unknown>}
 */
function waiting(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
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
 * @param hour
 * @param minute
 * @returns {Date}
 */
function targetTimer(hour, minute, sec) {
    const t = new Date();
    t.setHours(hour);
    t.setMinutes(minute);
    t.setSeconds(sec);
    t.setMilliseconds(0);
    return t;
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

/**
 *
 * @param n
 * @returns {string}
 */
function pad(n) {
    return n < 10 ? '0' + n : n
}

function countDownTimer(h, m, s) {
    let tdcTimer = setInterval(function () {
        let now = new Date().getTime();
        let distance = targetTimer(h, m, s) - now;

        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $("#tdcTimer").text(pad(hours) + ":" + pad(minutes) + ":" + pad(seconds))
        if (distance < 0) {
            clearInterval(tdcTimer);
            $("#tdcTimer").text("EXPIRED")
        }
    }, 1000);
}

/**
 *
 * @param property
 * @returns {boolean}
 */
function isEmpty(property) {
    return (property === null || property === "" || typeof property === "undefined");
}
