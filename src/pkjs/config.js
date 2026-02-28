module.exports = [
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
      },
      {
        "type": "toggle",
        "messageKey": "AppKeyNightMode",
        "defaultValue": true,
        "label": "Night Mode / Modo Nocturno",
        "description": "Black background / Fondo negro"
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
        "type": "checkboxgroup",
        "messageKey": "AppKeySatellites",

        "defaultValue": [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        "label": "Select Satellites / Seleccionar Satélites",
        "options": [
          { "label": "ISS (Crossband)", "value": "ISS" },
          { "label": "SO-50", "value": "SO-50" },
          { "label": "AO-27", "value": "AO-27" },
          { "label": "AO-91", "value": "AO-91" },
          { "label": "AO-92", "value": "AO-92" },
          { "label": "PO-101", "value": "PO-101" },
          { "label": "LilacSat-2", "value": "LilacSat-2" },
          { "label": "IO-86", "value": "IO-86" },
          { "label": "SONATE-2", "value": "SONATE-2" },
          { "label": "HADES-D", "value": "HADES-D" },
          { "label": "RS95S", "value": "RS95S" },
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
    "type": "section",
    "items": [
      {
        "type": "submit",
        "defaultValue": "Save / Guardar"
      }
    ]
  }
];


