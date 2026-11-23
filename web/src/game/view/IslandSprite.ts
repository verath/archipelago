import { Container, Graphics, Sprite, Text } from "pixi.js";

import * as images from "../../images/index.ts";
import type ResourceHolder from "../../resource/ResourceHolder.ts";
import type IslandModel from "../model/IslandModel.ts";
import type { PlayerColor } from "../model/PlayerColors.ts";
import BaseSprite, { ownerColor } from "./BaseSprite.ts";
import { FONT_FAMILY_DEFAULT } from "./constants.ts";
import { TILE_HEIGHT, TILE_WIDTH } from "./GameView.ts";


const EVENT_CLICK = Symbol("EVENT_CLICK");

export type IslandClickListener = (island: IslandModel) => void;

const ISLAND_TEXTURES = [
    images.TEXTURE_ISLAND1,
    images.TEXTURE_ISLAND2,
    images.TEXTURE_ISLAND3,
    images.TEXTURE_ISLAND4,
    images.TEXTURE_ISLAND5,
    images.TEXTURE_ISLAND6
];
const SELECTED_TEXTURE = images.TEXTURE_SELECTED;
const STRENGTH_TEXT_STROKE_WIDTH = 1;

// The garrison shield: its size, and where its center is from the island's
// center, on screen [px at scale 1]. Top right, clear of the strength text.
const SHIELD_WIDTH = 44;
const SHIELD_HEIGHT = 50;
const SHIELD_OFFSET_X = 42;
const SHIELD_OFFSET_Y = -38;
const SHIELD_FILL = 0xe8ebef;
const SHIELD_STROKE = 0x2f3b45;

export default class IslandSprite extends BaseSprite<IslandModel> {

    private readonly _strengthText: Text;

    /**
     * The strength shown by the strength text, null before the first update.
     */
    private _shownStrength: number | null = null;

    /**
     * The player color currently applied to the strength text.
     */
    private _strengthTextColor: PlayerColor | null = null;

    private readonly _selectedIndicator: Sprite;

    /**
     * The shield showing the island's garrison, hidden without one.
     */
    private readonly _garrison: Container;

    private readonly _garrisonText: Text;

    /**
     * The garrison shown by the shield, null before the first update.
     */
    private _shownGarrison: number | null = null;

    /**
     * Islands don't move or change size, so the sprite is placed and scaled
     * here, once.
     */
    constructor(resourceHolder: ResourceHolder, island: IslandModel) {
        const textureIdx = Math.floor(Math.random() * ISLAND_TEXTURES.length);
        const textureId = ISLAND_TEXTURES[textureIdx];
        super(resourceHolder, textureId, island);

        // Center our anchor to the middle of the tile
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);

        this._strengthText = IslandSprite._createStrengthText();
        this.addChild(this._strengthText);

        this._selectedIndicator = IslandSprite._createSelectedIndicator(resourceHolder);
        this._selectedIndicator.alpha = 0;
        this.addChild(this._selectedIndicator);

        this._garrisonText = IslandSprite._createGarrisonText();
        this._garrison = IslandSprite._createGarrison(this._garrisonText);
        this._garrison.visible = false;
        this.addChild(this._garrison);

        // Set scale depending on the island size. Island size is 0-1,
        // we scale that to make sure they are not too small.
        const scale = (island.size * 0.8 + 0.2);
        this.scale.set(scale, scale);
        // Undo scale for selected indicator, implicitly use it as a larger
        // touch target.
        this._selectedIndicator.scale.set(1 / scale, 1 / scale);

        // Update our position, account for anchor being in the center
        const x = island.position.x * TILE_WIDTH + TILE_WIDTH / 2;
        const y = island.position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
        this.position.set(x, y);

        // Apply a random 90deg step rotation to sprite, to simulate variety.
        const rotations = [0, Math.PI * 1 / 2, Math.PI, Math.PI * 3 / 2];
        this.rotation = rotations[Math.floor(Math.random() * rotations.length)];
        this._strengthText.rotation -= this.rotation;
        this._placeGarrison(scale);

        // Listen for clicks (pointer events cover both mouse and touch)
        this.eventMode = "static";
        this.on("pointerdown", this._onClicked);
    }


    private static _createStrengthText(): Text {
        const strengthText = new Text({
            text: "",
            style: {
                fontFamily: FONT_FAMILY_DEFAULT,
                fontSize: 50,
                align: "center",
                fill: 0x000000,
                stroke: { color: 0x000000, width: STRENGTH_TEXT_STROKE_WIDTH },
            },
        });
        strengthText.anchor.set(0.5, 0.5);
        strengthText.x = (TILE_WIDTH / 2);
        strengthText.y = (TILE_HEIGHT / 2);
        return strengthText;
    }

    /**
     * A shield, with the garrison text on it.
     */
    private static _createGarrison(text: Text): Container {
        const w = SHIELD_WIDTH / 2;
        const h = SHIELD_HEIGHT / 2;
        const shield = new Graphics()
            .moveTo(-w, -h)
            .lineTo(w, -h)
            .lineTo(w, 0)
            .quadraticCurveTo(w, h * 0.7, 0, h)
            .quadraticCurveTo(-w, h * 0.7, -w, 0)
            .closePath()
            .fill(SHIELD_FILL)
            .stroke({ color: SHIELD_STROKE, width: 3 });
        const garrison = new Container();
        garrison.addChild(shield);
        garrison.addChild(text);
        return garrison;
    }

    private static _createGarrisonText(): Text {
        const text = new Text({
            text: "",
            style: {
                fontFamily: FONT_FAMILY_DEFAULT,
                fontSize: 24,
                fontWeight: "bold",
                align: "center",
                fill: SHIELD_STROKE,
            },
        });
        text.anchor.set(0.5, 0.5);
        // A bit above the middle, where the shield is widest.
        text.y = -3;
        return text;
    }

    /**
     * Places the garrison shield at the top right of the island on screen,
     * upright and at the same size whatever the island's rotation and scale.
     */
    private _placeGarrison(scale: number): void {
        const cos = Math.cos(-this.rotation);
        const sin = Math.sin(-this.rotation);
        const x = SHIELD_OFFSET_X / scale;
        const y = SHIELD_OFFSET_Y / scale;
        this._garrison.position.set(
            TILE_WIDTH / 2 + x * cos - y * sin,
            TILE_HEIGHT / 2 + x * sin + y * cos,
        );
        this._garrison.rotation = -this.rotation;
        this._garrison.scale.set(1 / scale, 1 / scale);
    }

    private static _createSelectedIndicator(resourceHolder: ResourceHolder): Sprite {
        const selectedIndicator = new Sprite(resourceHolder.getTexture(SELECTED_TEXTURE));
        selectedIndicator.anchor.set(0.5, 0.5);
        selectedIndicator.x = (TILE_WIDTH / 2);
        selectedIndicator.y = (TILE_HEIGHT / 2);
        return selectedIndicator;
    }

    update(): void {
        const island = this.model;
        this._sprite.tint = ownerColor(island).fill;
        this._updateStrengthText(island);
        this._updateGarrison(island);
        // Show island selected indicator
        this._selectedIndicator.alpha = island.selected ? 1 : 0;
    }

    /**
     * Update the strength text number, and set its color depending
     * on who owns the island
     */
    private _updateStrengthText(island: IslandModel): void {
        // Only set the text when it changes, as Pixi re-renders it then.
        const strength = island.strength;
        if (this._shownStrength !== strength) {
            this._shownStrength = strength;
            // Negative strength => in FoW.
            this._strengthText.text = (strength >= 0) ? "" + strength : "";
        }
        // Only touch the style when the color changes, as any style change
        // makes Pixi re-render the text.
        const color = ownerColor(island);
        if (this._strengthTextColor !== color) {
            this._strengthTextColor = color;
            this._strengthText.style.fill = color.textFill;
            this._strengthText.style.stroke = { color: color.textStroke, width: STRENGTH_TEXT_STROKE_WIDTH };
        }
    }

    /**
     * Shows the garrison on the shield, or hides the shield without one.
     */
    private _updateGarrison(island: IslandModel): void {
        const garrison = island.garrison;
        if (this._shownGarrison === garrison) {
            return;
        }
        this._shownGarrison = garrison;
        this._garrison.visible = garrison > 0;
        if (garrison > 0) {
            this._garrisonText.text = "" + garrison;
        }
    }

    private _onClicked(): void {
        this.emit(EVENT_CLICK, this.model);
    }

    addClickListener(listener: IslandClickListener, context: unknown = null): void {
        this.on(EVENT_CLICK, listener, context);
    }

    removeClickListener(listener: IslandClickListener, context: unknown = null): void {
        this.off(EVENT_CLICK, listener, context);
    }
}
