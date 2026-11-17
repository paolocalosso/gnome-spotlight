/**
 * Bordo do painel configurável: espessura, raio e cor viram estilo inline (o St aplica por
 * último, então ganha da folha da extensão). Cor vazia ou suspeita fica com a cor do tema.
 */
import { describe, expect, test } from "bun:test";

import { buildPanelBorderStyle, isValidBorderColor } from "@domain/appearance/panelBorder";

describe("buildPanelBorderStyle", () => {
  test("gera espessura, raio e cor", () => {
    expect(buildPanelBorderStyle({ width: 2, radius: 12, color: "#ff0000" })).toBe(
      "border-width: 2px; border-radius: 12px; border-color: #ff0000;",
    );
  });

  test("cor vazia mantém a cor do tema", () => {
    expect(buildPanelBorderStyle({ width: 1, radius: 18, color: "" })).toBe(
      "border-width: 1px; border-radius: 18px;",
    );
  });

  test("limita os valores à faixa do schema", () => {
    expect(buildPanelBorderStyle({ width: 99, radius: -5, color: "" })).toBe(
      "border-width: 10px; border-radius: 0px;",
    );
  });

  test("descarta cor que injetaria outra regra", () => {
    expect(isValidBorderColor("red; background: blue")).toBe(false);
    expect(isValidBorderColor("rgba(255,0,0,0.5)")).toBe(true);
  });
});
