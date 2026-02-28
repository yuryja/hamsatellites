var Clay = require('pebble-clay');
var clayConfig = [
    {
        "type": "heading",
        "defaultValue": "Settings / Configuración"
    },
    {
        "type": "section",
        "items": [
            {
                "type": "heading",
                "defaultValue": "General"
            },
            {
                "type": "select",
                "messageKey": "AppKeyLanguage",
                "defaultValue": "en",
                "label": "Language / Idioma",
                "options": [
                    { "label": "English", "value": "en" },
                    { "label": "Español", "value": "es" },
                    { "label": "Français", "value": "fr" },
                    { "label": "Português", "value": "pt" },
                    { "label": "Italiano", "value": "it" }
                ]
            },
            {
                "type": "input",
                "messageKey": "AppKeyLocation",
                "defaultValue": "",
                "label": "Location / Ubicación",
                "description": "Leave blank to use phone GPS / Dejar en blanco para GPS del teléfono"
            },
            {
                "type": "slider",
                "messageKey": "AppKeyAlertTime",
                "defaultValue": 15,
                "label": "Alert Time (mins) / Tiempo de alerta previa",
                "min": 1,
                "max": 30,
                "step": 1
            }
        ]
    },
    {
        "type": "section",
        "items": [
            {
                "type": "heading",
                "defaultValue": "Satellites / Satélites"
            },
            {
                "type": "checkboxGroup",
                "messageKey": "AppKeySatellites",
                "defaultValue": ["ISS", "SO-50"],
                "label": "Select Satellites / Seleccionar Satélites",
                "options": [
                    { "label": "ISS (Crossband Repeater)", "value": "ISS" },
                    { "label": "SO-50 (SaudiSat-1C)", "value": "SO-50" },
                    { "label": "AO-27 (AMRAD-OSCAR 27)", "value": "AO-27" },
                    { "label": "AO-91 (Fox-1)", "value": "AO-91" },
                    { "label": "AO-92 (Fox-1)", "value": "AO-92" },
                    { "label": "PO-101 (Diwata-2)", "value": "PO-101" },
                    { "label": "LilacSat-2 (CAS-3H)", "value": "LilacSat-2" },
                    { "label": "IO-86 (LAPAN-A2)", "value": "IO-86" },
                    { "label": "SONATE-2", "value": "SONATE-2" },
                    { "label": "HADES-D", "value": "HADES-D" },
                    { "label": "RS95S (QMR-KWT-2)", "value": "RS95S" },
                    { "label": "Tevel-1", "value": "Tevel-1" },
                    { "label": "Tevel-2", "value": "Tevel-2" },
                    { "label": "Tevel-3", "value": "Tevel-3" },
                    { "label": "Tevel-4", "value": "Tevel-4" },
                    { "label": "Tevel-5", "value": "Tevel-5" },
                    { "label": "Tevel-6", "value": "Tevel-6" },
                    { "label": "Tevel-7", "value": "Tevel-7" },
                    { "label": "Tevel-8", "value": "Tevel-8" }
                ]
            }
        ]
    },
    {
        "type": "submit",
        "defaultValue": "Save Settings / Guardar Cambios"
    }
];
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
    var satellites = settings.AppKeySatellites || ["ISS", "SO-50"];

    var mockPasses = satellites.map(function (satId, index) {
        return {
            sat_id: satId,
            name: satId,
            start: Math.floor(Date.now() / 1000) + (index * 3600),
            end: Math.floor(Date.now() / 1000) + (index * 3600) + 600,
            uplink: "145.850",
            downlink: "436.795"
        };
    });

    var messages = [];
    mockPasses.forEach(function (pass) {
        messages.push({
            "AppKeySatellites": pass.name + "|" + pass.start + "|" + pass.end + "|" + pass.uplink + "|" + pass.downlink
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
    var dict = clay.getSettings(e.response);
    lang = dict.AppKeyLanguage || "en";

    Pebble.sendAppMessage({
        "AppKeyLanguage": lang,
        "AppKeyAlertTime": dict.AppKeyAlertTime || 15
    }, function () {
        getLocationAndFetch();
    }, function (e) {
        getLocationAndFetch();
    });
});
