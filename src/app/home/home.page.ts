import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('enemyDiv') enemyElement: ElementRef
  @ViewChild('shlas') shlasElement: ElementRef
  public damage:number = 1
  public gold:number = 0
  public critMultiplier:number = 2
  public palier:number = 1
  public level:number = 1
  public enemyLevelKilled:number = 0
  public totalEnemiKilled:number = 0
  public displayStats: boolean = true
  public inDead: boolean = false;
  public timeOut: any = null;
  public enemyTimer: number = 60;
  public menuOpened: boolean = false
  public win = window

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
      price: 1000,
      effect: 'Critical Damage Multiplier'
  }
  public cloak = {
      name: 'cloak',
      damage: 0,
      lvl: 0,
      img: 'cloak',
      price: 100,
      interval: 1000,
      effect: 'Auto Damage'
  }
  public gloves = {
    name: 'gloves',
    freq: 1,
    goldBoost: 0,
    lvl: 0,
    img: 'gloves',
    price: 100,
    effect: 'Auto Attack Speed'
  }
  public boots = {
      name: 'boots',
      critChance: 0.01,
      lvl: 1,
      img: 'boots',
      price: 10,
      effect: 'Crit Chance'
  }
  public stuff = [
    this.sword,
    this.helmet, 
    this.cloak,
    this.gloves,
    this.boots
  ]

  constructor() {
    this.enemyTime()
    window['myClicker'] = this
  }


  /**
   * Readlly ? Just doin damage
   * @param event 
   * @param shlasAndShake 
   * @param damage 
   */
  public doDamage(event = null, shlasAndShake = true, damage = null) {
    this.enemy.currentLife = Math.floor(this.enemy.currentLife - ((damage ? damage : this.sword.damage) * this.damage))
    if (this.enemy.currentLife <= 0) {
      this.enemy.currentLife = this.enemy.maxLife
      this.enemy.percent = Math.round((this.enemy.currentLife / this.enemy.maxLife) * 100);
      this.inDead = true
      setTimeout (() => {
        this.inDead = false
      }, 1000)
      if (this.enemyTimer > 0) {
        this.enemyLevelKilled++
      }
      this.gold = Math.ceil(this.gold + this.enemy.gold + (this.enemy.gold * this.gloves.goldBoost))
      this.enemyTimer = 60
      this.totalEnemiKilled++
    }
    if (this.enemyLevelKilled >= 10 && this.level == 10) {
      this.enemyLevelKilled = 0;
      this.level = 0
      this.palier++
      this.enemy.lvl++
      this.enemy.gold = this.enemy.goldBase
      this.enemy.maxLife = this.enemy.currentLife
      this.enemy.maxLife = this.enemy.maxLife + (this.enemy.maxLife * (this.enemy.lvl / this.palier))
      this.enemy.gold = this.enemy.gold + (this.enemy.gold * (this.enemy.lvl * (this.palier / 100)))
      this.enemy.currentLife = this.enemy.maxLife
    }else if (this.enemyLevelKilled >= 10 && this.level < 10) {
      this.enemyLevelKilled = 0;
      this.level++;
      this.enemy.maxLife++
      this.enemy.currentLife = this.enemy.maxLife
      this.enemy.gold = Math.round(this.enemy.gold + (this.enemy.gold / this.enemy.goldBase))
    }

    this.enemy.percent = Math.round((this.enemy.currentLife / this.enemy.maxLife) * 100);


    // Animation
    if (shlasAndShake && event) {
      this.shlas(event)
      this.enemyElement.nativeElement.classList.add('shake')
      setTimeout(() => {
        this.enemyElement.nativeElement.classList.remove('shake')
      }, 200);
    }
  }


  /**
   * Sword Cut Animation
   * @param event 
   */
  public shlas (event) {
    this.gold = this.gold + this.palier
    let r = Math.floor(Math.random() * (145 - 120 + 1) + 110);
    this.shlasElement.nativeElement.style.opacity = 1
    this.shlasElement.nativeElement.style.width = '200px'
    this.shlasElement.nativeElement.style.transform = `rotate(${r}deg)`
    this.shlasElement.nativeElement.style.left = `${event.clientX - 50}px`
    this.shlasElement.nativeElement.style.top = `${event.clientY}px`
    setTimeout(() => {
      this.shlasElement.nativeElement.style.opacity = 0
    }, 200)
  }



  /**
   * Store
   * @param item part of stuff 
   */
  public buyItem(item) {
    this[item.name].lvl++
    this.gold = this.gold - this[item.name].price
    this[item.name].price = Math.round((this[item.name].price + (this[item.name].price * this[item.name].lvl)))
    this[item.name].price = this[item.name].lvl % 3 == 0 ? Math.round(this[item.name].price / 2) : this[item.name].price 
    switch (item.name) {
      case 'sword' :
        this.sword.damage = this.sword.damage + this.sword.damage
        break
      case 'helmet' :
        this.helmet.critMultiplier = this.helmet.critMultiplier + 0.1
        break
      case 'cloak' :
        this.cloak.damage = this.cloak.damage == 0 ? 1 : this.cloak.damage + (this.cloak.damage / this.cloak.lvl)
        if (this.timeOut) clearTimeout(this.timeOut)
        this.startAutoDamage()
        break
      case 'gloves' :
        this.gloves.freq = this.gloves.freq == 0.1 ? 0.1 : this.gloves.freq - 0.1
        this.gloves.goldBoost = this.gloves.lvl % 2 == 0 && this.gloves.goldBoost < 1 ? this.gloves.goldBoost + 0.1 : this.gloves.goldBoost
        if (this.timeOut) clearTimeout(this.timeOut)
        this.startAutoDamage()
        break
      case 'boots' :
        this.boots.critChance = this.boots.critChance + (this.boots.critChance * this.boots.lvl)
        break
    }
  }


  public startAutoDamage()
  {
    this.timeOut = setTimeout(() => {
      this.doDamage(null, false, this.cloak.damage)
      this.startAutoDamage()
    }, this.cloak.interval * this.gloves.freq)
  }


  public enemyTime()
  {
    setTimeout(() => {
      if (this.enemyTimer > 0) {
        this.enemyTimer--
      }
      this.enemyTime()
    }, 1000)
  }

  public toggleMenu()
  {
    this.menuOpened = !this.menuOpened
  }



}
