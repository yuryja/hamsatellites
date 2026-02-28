module.exports = function (lang) {
  var isSp = (lang === 'es');
  return [
    {
      "type": "heading",
      "defaultValue": isSp ? "Configuración" : "Settings"
    },
    {
      "type": "section",
      "items": [
        {
          "type": "heading",
          "defaultValue": isSp ? "General" : "General"
        },
        {
          "type": "select",
          "messageKey": "AppKeyLanguage",
          "defaultValue": "en",
          "label": isSp ? "Idioma" : "Language",
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
          "label": isSp ? "Ubicación" : "Location",
          "description": isSp ? "Dejar en blanco para GPS" : "Leave blank for phone GPS"
        },
        {
          "type": "slider",
          "messageKey": "AppKeyAlertTime",
          "defaultValue": 15,
          "label": isSp ? "Alerta previa (mins)" : "Alert Time (mins)",
          "min": 1,
          "max": 30,
          "step": 1
        },
        {
          "type": "toggle",
          "messageKey": "AppKeyNightMode",
          "defaultValue": true,
          "label": isSp ? "Modo Nocturno" : "Night Mode",
          "description": isSp ? "Fondo negro" : "Black background"
        }
      ]
    },
    {
      "type": "section",
      "items": [
        {
          "type": "heading",
          "defaultValue": isSp ? "Satélites" : "Satellites"
        },
        {
          "type": "checkboxgroup",
          "messageKey": "AppKeySatellites",
          "defaultValue": [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
          "label": isSp ? "Seleccionar" : "Select",
          "options": [
            "ISS (Crossband)",
            "SO-50",
            "AO-27",
            "AO-91",
            "AO-92",
            "PO-101",
            "LilacSat-2",
            "IO-86",
            "SONATE-2",
            "HADES-D",
            "RS95S",
            "Tevel-1",
            "Tevel-2",
            "Tevel-3",
            "Tevel-4",
            "Tevel-5",
            "Tevel-6",
            "Tevel-7",
            "Tevel-8"
          ]
        }
      ]
    },
    {
      "type": "submit",
      "defaultValue": isSp ? "Guardar" : "Save"
    }
  ];
};




