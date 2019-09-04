const iterations = 50;
const multiplier = 1000000000;

const debug = true

let high_level = 10
let low_level = 10
let seq = "1010101";

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

/**
 * Main function
 * @returns {Promise<void>}
 */
async function main() {
    for (let i = 0; i < seq.length; i++) {
        if (seq[i] == '1') {
            running(high_level * 1000)
            if (debug) {
                $("#ntu-message").append("<li class=\"list-group-item list-group-item-success\">A bit '1' has been sent!</li>")
            }
        } else {
            await waiting(high_level * 1000).then(() => {
                $("#ntu-message").append("<li class=\"list-group-item list-group-item-danger\">A bit '0' has been sent!</li>")
            })
            await waiting(300)
        }
    }
}

function runTest() {
    // seq = $("#tdc-input-info").val();
    // high_level = $("#tdc-input-hl").val();
    // low_level = $("#tdc-input-lw").val();
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
            })
        }, 100);

    });
}

$(function () {
    $("#ntu-starter").on("click", function () {
        runTest();
    });
    $("#ntu-cleaner").on("click", function () {
        $("#ntu-message").empty()
    });
});
