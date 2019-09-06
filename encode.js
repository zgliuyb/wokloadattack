const iterations = 50;
const multiplier = 1000000000;

const debug = true

let high_level = 10
let low_level = 10
let seq = "1010101";
let finalOut = []

//==============================================
function waiting(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * ms
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

function getCurTime() {
    let startTime = new Date().toISOString()
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

function isEmpty(property) {
    return (property === null || property === "" || typeof property === "undefined");
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
    $("#ntu-starter").on("click", function () {
        $("#tdcOverlay").show();
        startEncoding();
    });
    $("#ntu-cleaner").on("click", function () {
        $("#ntu-message").empty()
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
