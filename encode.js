/*!
 * Web Workloads Attack V0.1
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 *
 * Author: LYB,LHT
 * Date: 2019-09-06T21:04Z
 *
 */
const iterations = 50;
const multiplier = 1000000000;

const debug = true

let high_level = 10
let low_level = 10
let seq = "1010101";
let finalOut = []

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
        var primes = calculatePrimes(iterations, multiplier);
    }
}

/**
 *
 * @param hour
 * @param minute
 * @returns {Date}
 */
function targetTimer(hour, minute, sec) {
    var t = new Date();
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
    var start = new Date().getTime();
    var primes = [];
    for (var i = 0; i < iterations; i++) {
        var candidate = i * (multiplier * Math.random());
        var isPrime = true;
        for (var c = 2; c <= Math.sqrt(candidate); ++c) {
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
    var end = new Date().getTime();
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
 * Main function
 * @returns {Promise<void>}
 */
async function main() {
    for (let i = 0; i < seq.length; i++) {
        if (seq[i] == '1') {
            let startTime = getCurTime();
            running(high_level * 1000)
            let endTime = getCurTime();
            if (debug) {
                $("#ntu-message").append("<li class=\"list-group-item list-group-item-success\">" + startTime + "<->" + endTime + ": Bit 1</li>")
            }
            finalOut.push([startTime, endTime, 1])
        } else {
            let startTime = getCurTime()
            await waiting(high_level * 1000).then(() => {
                let endTime = getCurTime()
                finalOut.push([startTime, endTime, 0])
                $("#ntu-message").append("<li class=\"list-group-item list-group-item-danger\">" + startTime + "<->" + endTime + ": Bit 0</li>")
            })
            await waiting(300)
        }
    }
}

/**
 *
 * @param property
 * @returns {boolean}
 */
function isEmpty(property) {
    return (property === null || property === "" || typeof property === "undefined");
}

/**
 *
 * @param h
 * @param m
 * @param s
 */
function startScheduling(h, m, s) {
    let tTime = targetTimer(h, m, s).getTime()
    let cTime = new Date().getTime();
    let offset = tTime - cTime;
    if (offset >= 0) {
        setTimeout(function () {
            $("#ntu-starter").trigger('click');
            console.log("Start Experiments.")
        }, offset);
    }
    countDownTimer(h, m, s)
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

function startEncoding() {
    let tmp = $("#tdcInputInfo").val()
    seq = isEmpty(tmp) ? seq : tmp;
    tmp = $("#tdcInputHL").val()
    high_level = isEmpty(tmp) ? parseInt(high_level) : tmp;
    tmp = $("#tdcInputLL").val()
    low_level = isEmpty(tmp) ? parseInt(low_level) : tmp;
    console.log(seq, high_level, low_level)
    Promise.resolve().then(() => {
        if (debug) {
            console.log("App started");
            $("#ntu-state").text("Running!")
        }
        $("#ntu-starter").prop("disabled", true)
        $("#ntu-cleaner").prop("disabled", true)
    }).then(() => {
        setTimeout(function () {
            main().then(r => {
                $("#ntu-starter").prop("disabled", false)
                $("#ntu-cleaner").prop("disabled", false)

                $('#ntu-state').removeClass('alert-warning').addClass('alert-success');

                $("#ntu-state").text("Finished!");
                $("#tdcFinalResult").val(JSON.stringify(finalOut));
                $("#tdcOverlay").hide(300);
            })
        }, 100);

    });
}

$(function () {
    let now = new Date().toLocaleTimeString()

    function getTwentyFourHourTime(now) {
        var d = new Date("1/1/2013 " + now);
        return d.getHours() + ':' + d.getMinutes() + ":" + d.getSeconds();
    }

    $("#colFormLabelLg").val(getTwentyFourHourTime(now));

    $("#ntu-scheduler").on("click", function () {

        let dest = $("#colFormLabelLg").val()
        let destTime = dest.split(" ")[0];
        let result = /([0-9]|[0-9]{2}:[0-9]|[0-9]{2}:[0-9]|[0-9]{2})/g.test(destTime);
        let finalValue = null
        if (result) {
            finalValue = destTime.split(":")
            startScheduling(finalValue[0], finalValue[1], finalValue[2]);
        } else {
            $("#colFormLabelLg").addClass('is-invalid');
        }
        $("#ntu-scheduler").prop("disabled", true);
    });
    $("#ntu-starter").on("click", function () {
        $("#tdcOverlay").show();
        startEncoding();
    });
    $("#ntu-cleaner").on("click", function () {
        $("#ntu-message").empty()
        $("#tdcFinalResult").val('')
    });
    $("#tdcInputInfo, #tdcInputHL, #tdcInputLL").on("keyup", function () {
        if (!/^\d+$/.test($(this).val())) {
            $(this).addClass('is-invalid');
            return false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });
});
