import Adw from "gi://Adw";
import Gdk from "gi://Gdk";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import { gettext as _ } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

import { BORDER_RADIUS_RANGE, BORDER_WIDTH_RANGE } from "@domain/appearance/panelBorder";
import { SettingsKey } from "@infra/gnome/settingsKeys";

const FALLBACK_COLOR = "rgba(255, 255, 255, 0.09)";

export class BorderGroup {
  readonly group: Adw.PreferencesGroup;
  private readonly colorButton = new Gtk.ColorDialogButton({
    dialog: new Gtk.ColorDialog({ with_alpha: true }),
    valign: Gtk.Align.CENTER,
  });
  private readonly resetButton = new Gtk.Button({
    icon_name: "edit-undo-symbolic",
    valign: Gtk.Align.CENTER,
    css_classes: ["flat"],
  });
  private syncing = false;

  constructor(private readonly settings: Gio.Settings) {
    this.group = new Adw.PreferencesGroup({ title: _("Border") });
    this.group.add(this.spinRow(_("Border width"), SettingsKey.BORDER_WIDTH, BORDER_WIDTH_RANGE));
    this.group.add(
      this.spinRow(_("Corner radius"), SettingsKey.BORDER_RADIUS, BORDER_RADIUS_RANGE),
    );

    this.resetButton.set_tooltip_text(_("Use the theme color"));
    const colorRow = new Adw.ActionRow({ title: _("Border color") });
    colorRow.add_suffix(this.resetButton);
    colorRow.add_suffix(this.colorButton);
    colorRow.activatable_widget = this.colorButton;
    this.group.add(colorRow);

    this.colorButton.connect("notify::rgba", () => this.storeColor());
    this.resetButton.connect("clicked", () => settings.set_string(SettingsKey.BORDER_COLOR, ""));
    settings.connect(`changed::${SettingsKey.BORDER_COLOR}`, () => this.syncColor());
    this.syncColor();
  }

  private spinRow(
    title: string,
    key: SettingsKey,
    range: { readonly min: number; readonly max: number },
  ): Adw.SpinRow {
    const row = new Adw.SpinRow({
      title,
      adjustment: new Gtk.Adjustment({ lower: range.min, upper: range.max, step_increment: 1 }),
    });
    this.settings.bind(key, row, "value", Gio.SettingsBindFlags.DEFAULT);
    return row;
  }

  private storeColor(): void {
    if (this.syncing) return;
    this.settings.set_string(SettingsKey.BORDER_COLOR, this.colorButton.get_rgba().to_string());
  }

  private syncColor(): void {
    const stored = this.settings.get_string(SettingsKey.BORDER_COLOR);
    const rgba = new Gdk.RGBA();
    if (!rgba.parse(stored)) rgba.parse(FALLBACK_COLOR);

    this.syncing = true;
    this.colorButton.set_rgba(rgba);
    this.syncing = false;
    this.resetButton.sensitive = stored !== "";
  }
}
