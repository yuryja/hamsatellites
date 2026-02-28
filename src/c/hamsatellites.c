#include <pebble.h>

#define MAX_SATELLITES 20
#define LANG_EN 0
#define LANG_ES 1
#define LANG_FR 2
#define LANG_PT 3
#define LANG_IT 4

typedef struct {
  char name[32];
  time_t start_time;
  time_t end_time;
  char uplink[16];
  char downlink[16];
} SatellitePass;

static SatellitePass s_passes[MAX_SATELLITES];
static int s_pass_count = 0;
static int s_current_pass_index = 0;
static int s_lang = LANG_EN;

static Window *s_main_window;
static TextLayer *s_name_layer;
static TextLayer *s_times_layer;
static TextLayer *s_freqs_layer;

// i18n Dictionary
static const char *s_dict[5][4] = {
    {"Loading...", "Uplink", "Downlink", "No Passes"},  // EN
    {"Cargando...", "Subida", "Bajada", "Sin Pasos"},   // ES
    {"Chargement...", "Montante", "Desc", "Aucun"},     // FR
    {"Carregando...", "Ligação", "Descida", "Nenhuma"}, // PT
    {"Caricamento...", "Salita", "Discesa", "Nessun"}   // IT
};

static void update_view(void) {
  if (s_pass_count == 0) {
    text_layer_set_text(s_name_layer, s_dict[s_lang][0]); // Loading
    text_layer_set_text(s_times_layer, "");
    text_layer_set_text(s_freqs_layer, "");
    return;
  }

  SatellitePass *pass = &s_passes[s_current_pass_index];
  text_layer_set_text(s_name_layer, pass->name);

  static char s_time_buffer[64];
  struct tm *s_tm = localtime(&pass->start_time);
  struct tm *e_tm = localtime(&pass->end_time);
  char start_buf[16], end_buf[16];
  strftime(start_buf, sizeof(start_buf), "%H:%M", s_tm);
  strftime(end_buf, sizeof(end_buf), "%H:%M", e_tm);
  snprintf(s_time_buffer, sizeof(s_time_buffer), "%s - %s", start_buf, end_buf);
  text_layer_set_text(s_times_layer, s_time_buffer);

  static char s_freq_buffer[64];
  snprintf(s_freq_buffer, sizeof(s_freq_buffer), "%s: %s\n%s: %s",
           s_dict[s_lang][1], pass->uplink, s_dict[s_lang][2], pass->downlink);
  text_layer_set_text(s_freqs_layer, s_freq_buffer);
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  if (s_current_pass_index > 0) {
    s_current_pass_index--;
    update_view();
  }
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
  if (s_current_pass_index < s_pass_count - 1) {
    s_current_pass_index++;
    update_view();
  }
}

static void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
}

static void main_window_load(Window *window) {
  window_set_background_color(window, GColorBlack);
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  s_name_layer = text_layer_create(GRect(0, 20, bounds.size.w, 30));
  text_layer_set_font(s_name_layer,
                      fonts_get_system_font(FONT_KEY_GOTHIC_28_BOLD));
  text_layer_set_text_alignment(s_name_layer, GTextAlignmentCenter);
  text_layer_set_text_color(s_name_layer, GColorWhite);
  text_layer_set_background_color(s_name_layer, GColorClear);
  layer_add_child(window_layer, text_layer_get_layer(s_name_layer));

  s_times_layer = text_layer_create(GRect(0, 60, bounds.size.w, 30));
  text_layer_set_font(s_times_layer,
                      fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD));
  text_layer_set_text_alignment(s_times_layer, GTextAlignmentCenter);
  text_layer_set_text_color(s_times_layer, GColorWhite);
  text_layer_set_background_color(s_times_layer, GColorClear);
  layer_add_child(window_layer, text_layer_get_layer(s_times_layer));

  s_freqs_layer = text_layer_create(GRect(0, 100, bounds.size.w, 60));
  text_layer_set_font(s_freqs_layer, fonts_get_system_font(FONT_KEY_GOTHIC_24));
  text_layer_set_text_alignment(s_freqs_layer, GTextAlignmentCenter);
  text_layer_set_text_color(s_freqs_layer, GColorWhite);
  text_layer_set_background_color(s_freqs_layer, GColorClear);
  layer_add_child(window_layer, text_layer_get_layer(s_freqs_layer));

  update_view();
}

static void main_window_unload(Window *window) {
  text_layer_destroy(s_name_layer);
  text_layer_destroy(s_times_layer);
  text_layer_destroy(s_freqs_layer);
}

static void in_recv_handler(DictionaryIterator *iterator, void *context) {
  Tuple *lang_t = dict_find(iterator, MESSAGE_KEY_AppKeyLanguage);
  if (lang_t && lang_t->type == TUPLE_CSTRING) {
    if (strcmp(lang_t->value->cstring, "es") == 0)
      s_lang = LANG_ES;
    else if (strcmp(lang_t->value->cstring, "fr") == 0)
      s_lang = LANG_FR;
    else if (strcmp(lang_t->value->cstring, "pt") == 0)
      s_lang = LANG_PT;
    else if (strcmp(lang_t->value->cstring, "it") == 0)
      s_lang = LANG_IT;
    else
      s_lang = LANG_EN;
    update_view();
  }

  Tuple *sat_t = dict_find(iterator, MESSAGE_KEY_AppKeySatellites);
  if (sat_t && sat_t->type == TUPLE_CSTRING && s_pass_count < MAX_SATELLITES) {
    char buffer[128];
    strncpy(buffer, sat_t->value->cstring, sizeof(buffer));
    buffer[sizeof(buffer) - 1] = '\0';

    char *name = buffer;
    char *start_str = strchr(name, '|');
    if (start_str) {
      *start_str = '\0';
      start_str++;
      char *end_str = strchr(start_str, '|');
      if (end_str) {
        *end_str = '\0';
        end_str++;
        char *up_str = strchr(end_str, '|');
        if (up_str) {
          *up_str = '\0';
          up_str++;
          char *down_str = strchr(up_str, '|');
          if (down_str) {
            *down_str = '\0';
            down_str++;

            strncpy(s_passes[s_pass_count].name, name,
                    sizeof(s_passes[0].name) - 1);
            s_passes[s_pass_count].start_time = atoi(start_str);
            s_passes[s_pass_count].end_time = atoi(end_str);
            strncpy(s_passes[s_pass_count].uplink, up_str,
                    sizeof(s_passes[0].uplink) - 1);
            s_passes[s_pass_count].downlink[sizeof(s_passes[0].downlink) - 1] =
                '\0'; // Ensure null termination
            strncpy(s_passes[s_pass_count].downlink, down_str,
                    sizeof(s_passes[0].downlink) - 1);
            s_passes[s_pass_count].uplink[sizeof(s_passes[0].uplink) - 1] =
                '\0'; // Ensure null termination
            s_pass_count++;

            update_view();
          }
        }
      }
    }
  }
}

static void prv_init(void) {
  // AppMessage open with large buffer
  app_message_register_inbox_received(in_recv_handler);
  app_message_open(512, 512);

  s_main_window = window_create();
  window_set_click_config_provider(s_main_window, click_config_provider);
  window_set_window_handlers(s_main_window, (WindowHandlers){
                                                .load = main_window_load,
                                                .unload = main_window_unload,
                                            });
  window_stack_push(s_main_window, true);
}

static void prv_deinit(void) { window_destroy(s_main_window); }

int main(void) {
  prv_init();
  app_event_loop();
  prv_deinit();
}
