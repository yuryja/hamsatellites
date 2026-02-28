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
            { "label": "English / Inglés", "value": "en" },
            { "label": "Español / Spanish", "value": "es" },
            { "label": "Français / Francés", "value": "fr" },
            { "label": "Português / Portugués", "value": "pt" },
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
        { "type": "toggle", "messageKey": "AppKeySat_ISS", "label": "ISS (Crossband)", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_SO50", "label": "SO-50", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_AO27", "label": "AO-27", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_AO91", "label": "AO-91", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_AO92", "label": "AO-92", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_PO101", "label": "PO-101", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_LILAC", "label": "LilacSat-2", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_IO86", "label": "IO-86", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_SONATE", "label": "SONATE-2", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_HADESD", "label": "HADES-D", "defaultValue": true },
        { "type": "toggle", "messageKey": "AppKeySat_RS95S", "label": "RS95S", "defaultValue": true }
      ]
    },
    {
      "type": "submit",
      "defaultValue": isSp ? "Guardar" : "Save"
    }
  ];
};
