import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public damage:number = 1
  public gold:number = 0
  public critMultiplier:number = 2
  public palier:number = 1
  public level:number = 1
  public enemyLevelKilled:number = 0
  public totalEnemiKilled:number = 0
  public displayStats: boolean = true
  public inDead: boolean = false;

  public enemy = {
    lvl: 1,
    currentLife: 5,
    maxLife: 5,
    percent: 100,
    goldBase: 1,
    gold: 1
  }
  public sword = {
      name: 'sword',
      damage: 1,
      lvl: 1,
      img: 'sword',
      price: 300,
      effect: 'Click damage'
  }
  public helmet = {
      name: 'helmet',
      critMultiplier: 1,
      lvl: 0,
      img: 'helmet',
      price: 100,
      effect: 'Critical Damage Multiplier'
  }
  public cloak = {
      name: 'cloak',
      damage: 0,
      lvl: 0,
      img: 'cloak',
      price: 1000,
      interval: 1000,
      effect: 'Auto Damage'
  }
  public gloves = {
    name: 'gloves',
    freq: 10,
    lvl: 0,
    img: 'gloves',
    price: 1000,
    effect: 'Auto Attack Speed'
  }
  public boots = {
      name: 'boots',
      critChance: 0.01,
      lvl: 1,
      img: 'boots',
      price: 100,
      effect: 'Crit Chance'
  }
  public stuff = [
    this.sword, 
    this.helmet,
    this.cloak,
    this.gloves,
    this.boots,
  ]

  constructor() {

  }

  public doDamage() {
    this.enemy.currentLife = this.enemy.currentLife - this.sword.damage
    if (this.enemy.currentLife == 0) {
      this.enemy.currentLife = this.enemy.maxLife
      this.enemy.percent = Math.round((this.enemy.currentLife / this.enemy.maxLife) * 100);
      this.inDead = true
      setTimeout (() => {
        this.inDead = false
      }, 1000)
      this.enemyLevelKilled++
      this.totalEnemiKilled++
    }
    if (this.enemyLevelKilled >= 10 && this.level == 10) {
      this.enemyLevelKilled = 0;
      this.level = 0
      this.palier++
      this.enemy.lvl++
      this.enemy.gold = this.enemy.goldBase
      this.enemy.maxLife = this.enemy.currentLife
      this.enemy.maxLife = this.enemy.maxLife + (this.enemy.maxLife * this.enemy.lvl)
      this.enemy.gold = this.enemy.gold + (this.enemy.gold * this.enemy.lvl)
      this.enemy.currentLife = this.enemy.maxLife
    }else if (this.enemyLevelKilled >= 10 && this.level < 10) {
      this.enemyLevelKilled = 0;
      this.level++;
      this.enemy.maxLife++
      this.enemy.currentLife = this.enemy.maxLife
      this.enemy.gold = Math.round(this.enemy.gold + (this.enemy.gold / this.enemy.goldBase))
    }
    this.gold = Math.ceil(this.gold + this.enemy.gold)
    this.enemy.percent = Math.round((this.enemy.currentLife / this.enemy.maxLife) * 100);
  }

}
