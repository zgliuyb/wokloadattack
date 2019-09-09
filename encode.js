/*!
 * Web Workloads Attack V0.1
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 *
 * Author: LYB, LHT
 * Date: 2019-09-06T21:04Z
 *
 */
const iterations = 50;
const multiplier = 1000000000;

const debug = true;

let high_level = 10;
let low_level = 10;
let seq = "1010101";
let finalOut = [];

let isMute = false;

let workThreadCount = 3;

/**
 * Main function
 * @returns {Promise<void>}
 */
async function OnOffKeyTransmitter() {
    for (let i = 0; i < seq.length; i++) {
        if (seq[i] == '1') {
            let startTime = getCurTime();
            running(high_level * 1000)
            let endTime = getCurTime();
            if (debug && !isMute) {
                $("#ntu-message").append("<li class=\"list-group-item list-group-item-success\">" + startTime + "<->" + endTime + ": Bit 1</li>")
            }
            finalOut.push([startTime, endTime, 1])
        } else {
            let startTime = getCurTime()
            await waiting(high_level * 1000).then(() => {
                let endTime = getCurTime()
                finalOut.push([startTime, endTime, 0])
                if (debug && !isMute) {
                    $("#ntu-message").append("<li class=\"list-group-item list-group-item-danger\">" + startTime + "<->" + endTime + ": Bit 0</li>")
                }
            })
            await waiting(300)
        }
    }
}

/**
 * start scheduling at h:m:s
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
 * worker.js Mode
 */
function workJsMode(workThreadCount) {
    let workCount = workThreadCount;

    let workThread = []

    for (let i = 0; i < workCount; i++) {
        let tdcWorker = new Worker('workload.js');
        workThread.push(tdcWorker);
    }
    for (let i = 0; i < workCount; i++) {
        let tdcWorker = workThread[i];
        tdcWorker.postMessage(["true", seq, high_level, low_level, iterations, multiplier, finalOut, "PlaceHolder"]);
        tdcWorker.onmessage = function (e) {
            let textContent = e.data;
            let tmp = $("#tdcFinalResult").val()
            tmp = tmp + ",##THD" + i + "##" + JSON.stringify(textContent)
            $("#tdcFinalResult").val(tmp);
            tmp = $("#ntu-state").text()
            tmp = tmp + ",##THD" + i + ":Finished##"
            $("#ntu-state").text(tmp);
            let rest = $('#tdcOverlay').is(':visible');
            if (rest) {
                $("#tdcOverlay").hide(300);
            }

        }
    }
}

/**
 * Loop mode
 */
function loopMode() {
    Promise.resolve().then(() => {
        if (debug) {
            console.log("App started");
            $("#ntu-state").text("Running!")
        }
        $("#ntu-starter").prop("disabled", true)
        $("#ntu-cleaner").prop("disabled", true)
    }).then(() => {
        setTimeout(function () {
            OnOffKeyTransmitter().then(r => {
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

/**
 * start test
 */
function startEncoding() {
    let tmp = $("#tdcInputInfo").val()
    seq = isEmpty(tmp) ? seq : tmp;
    tmp = $("#tdcInputHL").val()
    high_level = isEmpty(tmp) ? high_level : parseInt(tmp);
    tmp = $("#tdcInputLL").val()
    low_level = isEmpty(tmp) ? low_level : parseInt(tmp);
    tmp = $("#tdcThread").val()
    workThreadCount = isEmpty(tmp) ? workThreadCount : parseInt(tmp);
    isMute = $("#tdcMuteOut").is(":checked")
    tmp = $("#tdcRunningWay").val()

    console.log(seq, high_level, low_level)

    if (tmp == "Loop") {
        loopMode();
    } else if (tmp === "Worker.js") {
        workJsMode(workThreadCount);
    }
}

//=============================================
//
//  Encoding main entrance
//
//=============================================
$(function () {
    let now = new Date().toLocaleTimeString()

    function getTwentyFourHourTime(now) {
        const d = new Date("1/1/2013 " + now);
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
