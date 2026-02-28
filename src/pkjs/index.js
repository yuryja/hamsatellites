var Clay = require('pebble-clay');
var clayConfig = require('./config');

var clay = new Clay(clayConfig, null, { autoHandleEvents: false });

var lang = "en"; // default language

function sendNextMessage(messages) {
    if (messages.length === 0) return;
    var msg = messages.shift();
    Pebble.sendAppMessage(msg, function () {
        sendNextMessage(messages);
    }, function (e) {
        console.log("Failed to send msg:", JSON.stringify(msg));
        sendNextMessage(messages);
    });
}

function fetchSatellitePasses(lat, lon) {
    var settings = JSON.parse(localStorage.getItem('clay-settings') || '{}');
    var satellites = settings.AppKeySatellites || ["ISS", "SO-50", "AO-27", "AO-91", "AO-92", "PO-101", "LilacSat-2", "IO-86", "SONATE-2", "HADES-D", "RS95S", "Tevel-1", "Tevel-2", "Tevel-3", "Tevel-4", "Tevel-5", "Tevel-6", "Tevel-7", "Tevel-8"];

    var mockPasses = satellites.map(function (satId, index) {
        var tone = "None";
        if (satId === "SO-50") tone = "67.0";
        else if (satId === "AO-91" || satId === "AO-92") tone = "67.0";
        else if (satId === "ISS") tone = "67.0";
        else if (satId === "AO-27") tone = "None"; // Varies or doesn't use normally

        return {
            sat_id: satId,
            name: satId,
            start: Math.floor(Date.now() / 1000) + (index * 3600),
            end: Math.floor(Date.now() / 1000) + (index * 3600) + 600,
            uplink: "145.850",
            downlink: "436.795",
            tone: tone
        };
    });

    var messages = [];
    mockPasses.forEach(function (pass) {
        messages.push({
            "AppKeySatellites": pass.name + "|" + pass.start + "|" + pass.end + "|" + pass.uplink + "|" + pass.downlink + "|" + pass.tone
        });
    });
    sendNextMessage(messages);
}

function getLocationAndFetch() {
    var settings = JSON.parse(localStorage.getItem('clay-settings') || '{}');
    var locString = settings.AppKeyLocation;
    if (locString && locString.trim() !== "") {
        var parts = locString.split(",");
        if (parts.length === 2) {
            fetchSatellitePasses(parseFloat(parts[0]), parseFloat(parts[1]));
        }
    } else {
        navigator.geolocation.getCurrentPosition(function (pos) {
            fetchSatellitePasses(pos.coords.latitude, pos.coords.longitude);
        }, function (err) {
            console.log('Error getting location');
            fetchSatellitePasses(0, 0); // fallback
        }, {
            timeout: 10000,
            maximumAge: 60000
        });
    }
}

Pebble.addEventListener('ready', function () {
    var settings = JSON.parse(localStorage.getItem('clay-settings') || '{}');
    lang = settings.AppKeyLanguage || "en";
    getLocationAndFetch();
});

Pebble.addEventListener('showConfiguration', function (e) {
    Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function (e) {
    if (e && !e.response) {
        return;
    }
    var dict = clay.getSettings(e.response, false);

    // Map checkboxgroup booleans back to satellite names
    if (dict.AppKeySatellites && Array.isArray(dict.AppKeySatellites)) {
        var satelliteNames = ["ISS", "SO-50", "AO-27", "AO-91", "AO-92", "PO-101", "LilacSat-2", "IO-86", "SONATE-2", "HADES-D", "RS95S", "Tevel-1", "Tevel-2", "Tevel-3", "Tevel-4", "Tevel-5", "Tevel-6", "Tevel-7", "Tevel-8"];
        var selectedSats = [];
        dict.AppKeySatellites.forEach(function (checked, index) {
            if (checked && index < satelliteNames.length) {
                selectedSats.push(satelliteNames[index]);
            }
        });
        dict.AppKeySatellites = selectedSats;
    }

    localStorage.setItem('clay-settings', JSON.stringify(dict));
    lang = dict.AppKeyLanguage || "en";

    Pebble.sendAppMessage({
        "AppKeyLanguage": lang,
        "AppKeyAlertTime": dict.AppKeyAlertTime || 15,
        "AppKeyNightMode": typeof dict.AppKeyNightMode !== 'undefined' ? (dict.AppKeyNightMode ? 1 : 0) : 1
    }, function () {
        getLocationAndFetch();
    }, function (e) {
        getLocationAndFetch();
    });
});
