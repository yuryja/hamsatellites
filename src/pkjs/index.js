var Clay = require('pebble-clay');
var configFn = require('./config');

var lang = "en"; // default language
var clay = new Clay(configFn(lang), null, { autoHandleEvents: false });

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
    var satellites = settings.AppKeySatellites || ["ISS (Crossband)", "SO-50", "AO-27", "AO-91", "AO-92", "PO-101", "LilacSat-2", "IO-86", "SONATE-2", "HADES-D", "RS95S", "Tevel-1", "Tevel-2", "Tevel-3", "Tevel-4", "Tevel-5", "Tevel-6", "Tevel-7", "Tevel-8"];

    var mockPasses = satellites.map(function (satId, index) {
        var tone = "None";
        if (satId.indexOf("SO-50") !== -1) tone = "67.0";
        else if (satId.indexOf("AO-91") !== -1 || satId.indexOf("AO-92") !== -1) tone = "67.0";
        else if (satId.indexOf("ISS") !== -1) tone = "67.0";

        return {
            sat_id: satId,
            name: satId.split(" ")[0], // Use short name
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

function sendSettingsToWatch(settings) {
    Pebble.sendAppMessage({
        "AppKeyLanguage": settings.AppKeyLanguage || "en",
        "AppKeyAlertTime": settings.AppKeyAlertTime || 15,
        "AppKeyNightMode": typeof settings.AppKeyNightMode !== 'undefined' ? (settings.AppKeyNightMode ? 1 : 0) : 1
    }, function () {
        getLocationAndFetch();
    }, function (e) {
        getLocationAndFetch();
    });
}

Pebble.addEventListener('ready', function () {
    var settings = JSON.parse(localStorage.getItem('clay-settings') || '{}');
    lang = settings.AppKeyLanguage || "en";
    sendSettingsToWatch(settings);
});

Pebble.addEventListener('showConfiguration', function (e) {
    clay.config = configFn(lang);
    Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function (e) {
    if (e && !e.response) {
        return;
    }

    // Get settings with value objects
    var dict = clay.getSettings(e.response, false);
    var settings = {};

    // Extract plain values
    Object.keys(dict).forEach(function (key) {
        if (dict[key] && typeof dict[key] === 'object' && 'value' in dict[key]) {
            settings[key] = dict[key].value;
        } else {
            settings[key] = dict[key];
        }
    });

    // Map checkboxgroup booleans back to satellite names
    if (settings.AppKeySatellites && Array.isArray(settings.AppKeySatellites)) {
        var satelliteNames = ["ISS (Crossband)", "SO-50", "AO-27", "AO-91", "AO-92", "PO-101", "LilacSat-2", "IO-86", "SONATE-2", "HADES-D", "RS95S", "Tevel-1", "Tevel-2", "Tevel-3", "Tevel-4", "Tevel-5", "Tevel-6", "Tevel-7", "Tevel-8"];
        var selectedSats = [];
        settings.AppKeySatellites.forEach(function (checked, index) {
            if (checked && index < satelliteNames.length) {
                selectedSats.push(satelliteNames[index]);
            }
        });
        settings.AppKeySatellites = selectedSats;
    }

    localStorage.setItem('clay-settings', JSON.stringify(settings));
    lang = settings.AppKeyLanguage || "en";
    sendSettingsToWatch(settings);
});
