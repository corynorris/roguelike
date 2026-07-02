import React, { Component } from "react";
import Map from "../containers/Map";
import Effects from "../containers/Effects";
import Enemies from "../containers/Enemies";
import Player from "../containers/Player";
import HealthPacks from "../containers/HealthPacks";
import Weapons from "../containers/Weapons";
import StatsBar from "../containers/StatsBar";
import Boss from "../containers/Boss";
import Const from "../core/constants";
import detectSwipe from "../core/detectSwipe";
import { Coord, SpriteData, Tile, Direction } from "../types";

interface RoguelikeProps {
	player: SpriteData;
	tiles: Tile[][];
	sprites: Map<string, SpriteData>;
	screen: { top: number; left: number };
	setupGame: () => Coord;
	resetGame: () => Coord;
	moveSprite: (id: string, x: number, y: number) => void;
	destroy: (id: string) => void;
	attackSprite: (id: string, damage: number) => void;
	setScreen: (offset: { top: number; left: number }) => void;
	setPower: (id: string, power: number) => void;
	healTo: (id: string, health: number) => void;
	toggleFog: () => void;
	defeat: () => void;
	victory: () => void;
	addExperience: (id: string, experience: number) => void;
	advanceTurn: () => void;
}

interface RoguelikeState {
	mounted: boolean;
}

class Roguelike extends Component<RoguelikeProps, RoguelikeState> {
	private handleKeyPressRef: (e: KeyboardEvent) => void;
	private handleSwipeRef: (direction: Direction) => void;
	private centerOnPlayerRef: () => void;
	private boundHandleKeyPress!: (e: Event) => void;

	constructor(props: RoguelikeProps) {
		super(props);
		this.handleKeyPressRef = this.handleKeyPress.bind(this);
		this.handleSwipeRef = this.handleSwipe.bind(this);
		this.centerOnPlayerRef = this.centerOnPlayer.bind(this);
		this.boundHandleKeyPress = this.handleKeyPressRef;
	}

	centerOn(x: number, y: number) {
		const windowX = window.innerWidth;
		const windowY = window.innerHeight;

		this.props.setScreen({
			left: windowX / 2 - x * Const.UNIT_WIDTH,
			top: windowY / 2 - y * Const.UNIT_HEIGHT,
		});
	}

	centerOnPlayer() {
		const { x, y } = this.props.player;
		this.centerOn(x, y);
	}

	resetGame() {
		const { x, y } = this.props.resetGame();
		this.centerOn(x, y);
	}

	battleEnemy(enemy: SpriteData) {
		const { player } = this.props;

		// Player attacks enemy without taking counter-damage
		const enemyHealth = enemy.health - player.power;

		if (enemyHealth <= 0) {
			if (enemy.name === Const.BOSS) {
				this.props.victory();
			} else {
				this.props.destroy(enemy.id);
				this.props.addExperience(
					player.id,
					(enemy.maxHealth + enemy.power) / 2,
				);
			}
			return;
		}

		this.props.attackSprite(enemy.id, player.power);
	}

	usePotion(sprite: SpriteData) {
		const { player } = this.props;
		this.props.destroy(sprite.id);
		this.props.healTo(player.id, player.health + sprite.health);
	}

	upgradeWeapon(sprite: SpriteData) {
		const { player } = this.props;
		this.props.setPower(player.id, player.power + sprite.power);
		this.props.destroy(sprite.id);
	}

	handleSprites(coord: string) {
		const { sprites } = this.props;
		if (sprites.has(coord)) {
			const sprite = sprites.get(coord)!;
			switch (sprite.name) {
				case Const.ENEMY:
				case Const.BOSS:
					this.battleEnemy(sprite);
					break;
				case Const.HEALTH:
					this.usePotion(sprite);
					break;
				case Const.WEAPON:
					this.upgradeWeapon(sprite);
					break;
				default:
					return;
			}
		}
	}

	movePlayer(x: number, y: number) {
		const coord = `${x}x${y}`;
		const { tiles, sprites, player } = this.props;

		if (sprites.has(coord)) {
			this.handleSprites(coord);
			this.props.advanceTurn();
			return;
		}

		if (tiles[x][y].type !== "wall") {
			this.centerOn(x, y);
			this.props.moveSprite(player.id, x, y);
			this.props.advanceTurn();
			return;
		}
	}

	handleSwipe(direction: Direction) {
		let { x, y } = this.props.player;

		switch (direction) {
			case "left":
				x -= 1;
				break;
			case "right":
				x += 1;
				break;
			case "up":
				y -= 1;
				break;
			case "down":
				y += 1;
				break;
			default:
				return;
		}
		this.movePlayer(x, y);
	}

	handleKeyPress(e: KeyboardEvent) {
		const key = e.which;
		if (key >= 37 && key <= 40) {
			e.preventDefault();
		}
		let { x, y } = this.props.player;
		switch (key) {
			case 82: // r
				this.resetGame();
				return;
			case 87: // w
			case 38: // up
				y -= 1;
				break;
			case 83: // s
			case 40: // down
				y += 1;
				break;
			case 65: // a
			case 37: // left
				x -= 1;
				break;
			case 68: // d
			case 39: // right
				x += 1;
				break;
			case 72: // h
				this.props.toggleFog();
				return;
			default:
				return;
		}
		this.movePlayer(x, y);
	}

	componentDidMount() {
		const { x, y } = this.props.setupGame();
		this.centerOn(x, y);
		detectSwipe(window as unknown as HTMLElement, this.handleSwipeRef);
		window.addEventListener("keydown", this.handleKeyPressRef);
		window.onresize = this.centerOnPlayerRef;
	}

	render() {
		return (
			<div>
				<StatsBar />
				<Effects />
				<div
					style={{
						left: `${this.props.screen.left}px`,
						top: `${this.props.screen.top}px`,
						position: "fixed",
					}}
				>
					<Map />
					<Player />
					<HealthPacks />
					<Weapons />
					<Boss />
					<Enemies />
				</div>
			</div>
		);
	}
}

export default Roguelike;
