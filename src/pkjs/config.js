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
