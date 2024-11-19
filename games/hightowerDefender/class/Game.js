class Game 
{
  data = null;
  
  constructor(data=false){
    if(data){
      this.setData(data);
    }else{
      this.initData();
    }
    this.start();
  }
  
  setData(data){
    this.data = data;
  }
    
  initData(){
    this.data = {};
    this.data.level = 1;
    this.data.cash = 0;
  }
  
  start(){
    this.loadLevel(this.data.level);
    
  }
  
}

//Enemy
//Health
//Attack
//Defence
//MovementSpeed
//AttackSpeed
//AttackRange

//EnemyTypes
//-Brawler
//-Bouncer
//-Guard
//-Knight
//-Archer
//-Catapult

class Enemy 
{
  type = null;
  level = 1;
  health = 1;
  attack = 1;
  defence = 0;
  /*speed = {};
  speed.move = 1;
  speed.attack = 1;
  speed.power = 1;*/
  range = 1;
  
  constructor(type, level){
  this.type = type;
  this.level = level;
    switch(type){
      case 'brawler':
        this.health = level;
        this.attack = level;
        this.defence = 0.25 * level;
        this.speed.attack = level;
        this.speed.move = level;
        this.speed.power = 0.25 * level;
        this.range = 1;
      break;
    }
  }
  
  damage(amount){
    this.health -= amount;
    if(this.health <= 0){
      this.die();
    }
  }
  
  die(){
    
  }
}

class Level 
{
  id = 0;
  enemies = [];
  constructor(id){
    this.id = id;
    this.generate();
  }
  generate(){
    const level = this.id;
    let enemyCount = (i * i) * 5;
    for(let i=0; i<enemyCount; i++){
      let enemy = {};
      enemy.health = level * enemyCount;
    }
  }
}