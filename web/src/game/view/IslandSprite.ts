import { Sprite, Text } from "pixi.js";

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

export default class IslandSprite extends BaseSprite<IslandModel> {

    private readonly _strengthText: Text;

    /**
     * The player color currently applied to the strength text.
     */
    private _strengthTextColor: PlayerColor | null;

    private readonly _selectedIndicator: Sprite;

    constructor(resourceHolder: ResourceHolder) {
        const textureIdx = Math.floor(Math.random() * ISLAND_TEXTURES.length);
        const textureId = ISLAND_TEXTURES[textureIdx];
        super(resourceHolder, textureId);

        // Center our anchor to the middle of the tile
        this.pivot.set(TILE_WIDTH / 2, TILE_HEIGHT / 2);

        this._strengthText = IslandSprite._createStrengthText();
        this.addChild(this._strengthText);

        this._strengthTextColor = null;

        this._selectedIndicator = IslandSprite._createSelectedIndicator(resourceHolder);
        this._selectedIndicator.alpha = 0;
        this.addChild(this._selectedIndicator);

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

    private static _createSelectedIndicator(resourceHolder: ResourceHolder): Sprite {
        const selectedIndicator = new Sprite(resourceHolder.getTexture(SELECTED_TEXTURE));
        selectedIndicator.anchor.set(0.5, 0.5);
        selectedIndicator.x = (TILE_WIDTH / 2);
        selectedIndicator.y = (TILE_HEIGHT / 2);
        return selectedIndicator;
    }

    protected override _onAdded(): void {
        super._onAdded();
        const island = this._model;
        if (island == null) {
            throw new Error("this._model == null");
        }

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

        this._sprite.tint = ownerColor(island).fill;
        this._updateStrengthText(island);

        // Apply a random 90deg step rotation to sprite, to simulate variety.
        const rotations = [0, Math.PI * 1 / 2, Math.PI, Math.PI * 3 / 2];
        this.rotation = rotations[Math.floor(Math.random() * rotations.length)];
        this._strengthText.rotation -= this.rotation;
    }

    protected override _onModelChanged(): void {
        const island = this._model;
        if (island == null) {
            throw new Error("this._model == null");
        }

        this._sprite.tint = ownerColor(island).fill;
        this._updateStrengthText(island);
        // Show island selected indicator
        if (island.selected) {
            this._selectedIndicator.alpha = 1;
        } else {
            this._selectedIndicator.alpha = 0;
        }
    }

    /**
     * Update the strength text number, and set its color depending
     * on who owns the island
     */
    private _updateStrengthText(island: IslandModel): void {
        if (island.strength >= 0) {
            this._strengthText.text = "" + island.strength;
        } else {
            // Negative strength => in FoW.
            this._strengthText.text = "";
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

    private _onClicked(): void {
        const island = this._model;
        this.emit(EVENT_CLICK, island);
    }

    addClickListener(listener: IslandClickListener, context: unknown = null): void {
        this.on(EVENT_CLICK, listener, context);
    }

    removeClickListener(listener: IslandClickListener, context: unknown = null): void {
        this.off(EVENT_CLICK, listener, context);
    }
}
