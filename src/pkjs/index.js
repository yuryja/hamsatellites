var Clay = require('pebble-clay');
var configFn = require('./config');

var lang = "en";
var clay = new Clay(configFn(lang), null, { autoHandleEvents: false });

var SATELLITE_MAP = [
    { key: "AppKeySat_ISS", name: "ISS (Crossband)" },
    { key: "AppKeySat_SO50", name: "SO-50" },
    { key: "AppKeySat_AO27", name: "AO-27" },
    { key: "AppKeySat_AO91", name: "AO-91" },
    { key: "AppKeySat_AO92", name: "AO-92" },
    { key: "AppKeySat_PO101", name: "PO-101" },
    { key: "AppKeySat_LILAC", name: "LilacSat-2" },
    { key: "AppKeySat_IO86", name: "IO-86" },
    { key: "AppKeySat_SONATE", name: "SONATE-2" },
    { key: "AppKeySat_HADESD", name: "HADES-D" },
    { key: "AppKeySat_RS95S", name: "RS95S" }
];

function sendNextMessage(messages) {
    if (messages.length === 0) {
        console.log("All messages sent successfully.");
        return;
    }
    var msg = messages.shift();
    Pebble.sendAppMessage(msg, function () {
        sendNextMessage(messages);
    }, function (e) {
        console.log("Failed to send msg, retrying...:", JSON.stringify(msg));
        messages.unshift(msg); // put back
        setTimeout(function () { sendNextMessage(messages); }, 1000);
    });
}

function fetchSatellitePasses(lat, lon) {
    var settings = JSON.parse(localStorage.getItem('clay-settings') || '{}');

    // Determine selected satellites from individual toggles
    var selectedSats = [];
    SATELLITE_MAP.forEach(function (item) {
        if (settings[item.key] === true || typeof settings[item.key] === 'undefined') {
            selectedSats.push(item.name);
        }
    });

    console.log("Selected satellites:", JSON.stringify(selectedSats));

    var mockPasses = selectedSats.map(function (satId, index) {
        var tone = "None";
        if (satId.indexOf("SO-50") !== -1) tone = "67.0";
        else if (satId.indexOf("AO-91") !== -1 || satId.indexOf("AO-92") !== -1) tone = "67.0";
        else if (satId.indexOf("ISS") !== -1) tone = "67.0";

        return {
            name: satId.split(" ")[0], // Use short name
            start: Math.floor(Date.now() / 1000) + (index * 600) + 60, // simulate soon
            end: Math.floor(Date.now() / 1000) + (index * 600) + 660,
            uplink: "145.850",
            downlink: "436.795",
            tone: tone
        };
    });

    var messages = [];
    // First, send a clear command
    messages.push({ "AppKeyClearBatch": 1 });

    mockPasses.forEach(function (pass) {
        messages.push({
            "AppKeySatellites": pass.name + "|" + pass.start + "|" + pass.end + "|" + pass.uplink + "|" + pass.downlink + "|" + pass.tone
        });
    });

    console.log("Sending " + messages.length + " messages to watch...");
    sendNextMessage(messages);
}

function getLocationAndFetch() {
    var settings = JSON.parse(localStorage.getItem('clay-settings') || '{}');
    var locString = settings.AppKeyLocation;
    if (locString && locString.trim() !== "") {
        console.log("Using fixed location:", locString);
        var parts = locString.split(",");
        if (parts.length === 2) {
            fetchSatellitePasses(parseFloat(parts[0]), parseFloat(parts[1]));
        } else {
            fetchSatellitePasses(0, 0);
        }
    } else {
        console.log("Fetching GPS location...");
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log("GPS success:", pos.coords.latitude, pos.coords.longitude);
            fetchSatellitePasses(pos.coords.latitude, pos.coords.longitude);
        }, function (err) {
            console.log('Error getting location - using fallback');
            fetchSatellitePasses(0, 0); // fallback
        }, {
            timeout: 10000,
            maximumAge: 60000
        });
    }
}

function sendSettingsToWatch(settings) {
    console.log("Sending base settings to watch...");
    Pebble.sendAppMessage({
        "AppKeyLanguage": settings.AppKeyLanguage || "en",
        "AppKeyAlertTime": settings.AppKeyAlertTime || 15,
        "AppKeyNightMode": (settings.AppKeyNightMode === false) ? 0 : 1
    }, function () {
        console.log("Settings sent successfully, now fetching passes...");
        getLocationAndFetch();
    }, function (e) {
        console.log("Failed to send initial settings, still fetching passes...");
        getLocationAndFetch();
    });
}

Pebble.addEventListener('ready', function () {
    console.log("Pebble JS ready");
    var settings = JSON.parse(localStorage.getItem('clay-settings') || '{}');
    lang = settings.AppKeyLanguage || "en";
    sendSettingsToWatch(settings);
});

Pebble.addEventListener('showConfiguration', function (e) {
    console.log("Showing configuration for lang:", lang);
    clay.config = configFn(lang);
    Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function (e) {
    if (e && !e.response) {
        console.log("Webview closed with no response");
        return;
    }

    console.log("Webview closed with response, processing...");
    var dict = clay.getSettings(e.response, false);
    var settings = {};

    Object.keys(dict).forEach(function (key) {
        if (dict[key] && typeof dict[key] === 'object' && 'value' in dict[key]) {
            settings[key] = dict[key].value;
        } else {
            settings[key] = dict[key];
        }
    });

    localStorage.setItem('clay-settings', JSON.stringify(settings));
    lang = settings.AppKeyLanguage || "en";
    console.log("Settings saved. New lang:", lang);
    sendSettingsToWatch(settings);
});
