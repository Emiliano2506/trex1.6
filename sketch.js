var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var pisoInvisible;
var nubes, nubes1;
var num;
var obstaculo1Imagen, obstaculo2Imagen,  obstaculo3Imagen, obstaculo4Imagen, obstaculo5Imagen, obstaculo6Imagen, obstaculo;
var numImagen;
var grupoDeObstaculosDelPiso;
var grupoDeNubes;
var salto;
var estadoDelJuego = "iniciando"
var restart, restartSprite;
var gameOver, gameOverSprite;
var score = 0
var musicaDeFondo
var botonMute;
var desmuteado;
var velo = -4
var rexInicio;

//var base_datos = firebase.database();


//variables de sonido
var dieSound, checkpointSound, jumpSound;
function preload(){
//Creacion de objetos 

      //Trex
     trex_running = loadAnimation("./Imagenes/trex1.png","./Imagenes/trex3.png","./Imagenes/trex4.png");
     trex_collided =loadAnimation("./Imagenes/trex_collided.png");
     rexInicio = loadImage("./Imagenes/trex1.png");
     groundImage = loadImage("./Imagenes/ground2.png");
      //nubes
     nubes1 = loadImage("./Imagenes/cloud.png");
     obstaculo1Imagen = loadImage("./Imagenes/obstacle1.png");
     obstaculo2Imagen = loadImage("./Imagenes/obstacle2.png");
     obstaculo3Imagen = loadImage("./Imagenes/obstacle3.png");
     obstaculo4Imagen = loadImage("./Imagenes/obstacle4.png");
     obstaculo5Imagen = loadImage("./Imagenes/obstacle5.png");
     obstaculo6Imagen = loadImage("./Imagenes/obstacle6.png");
     //carga de archivo de sonidochecpointSound.loadSound("checkpoint.mp3");
     dieSound=loadSound("./Sonidos/die.mp3");
     jumpSound=loadSound("./Sonidos/jump.mp3");
     checkpointSound=loadSound("./Sonidos/checkpoint.mp3");
     musicaDeFondo = loadSound("./Sonidos/CoroCoral.mp3");
     restart = loadImage("./Imagenes/restart.png"); 
     gameOver = loadImage("./Imagenes/gameOver.png");
}

function setup() {
  //Creacion de Cnvas 
  createCanvas(750,540)
  grupoDeObstaculosDelPiso=new Group();
  grupoDeNubes=new Group();
  
  //crear sprite de trex 
  trex = createSprite(50,260,20,50);

  trex.setCollider("rectangle",0,0,85,87);
  trex.debug = false;
  //Crear objeto trex  animado
     //Mandar variable  de animacion del Trex  
     trex.addAnimation("etiqueta2",trex_running);
     trex.addAnimation("etiqueta1",trex_collided);
     trex.addAnimation("etiqueta3",rexInicio);
     //trex.changeAnimation("etiqueta1");
     trex.scale = 0.5;
  
  //crear sprite de suelo
 ground=createSprite(10,265,100,10);
 ground.addImage("piso",groundImage)  //mover  piso   coordenada X - izquierda 
  
  //coordenada x de ground  hacer que se duplique

  
  //crear sprite de suelo invisible 
  pisoInvisible=createSprite(50,270,100,15);
  //creacion de sprites para la creacion de estado de juego end
  restartSprite = createSprite(375,270)
  restartSprite.addImage(restart);
  restartSprite.scale = 0.7
  restartSprite.visible = false;
  gameOverSprite = createSprite(375,200);
  gameOverSprite.addImage(gameOver);
  gameOverSprite.scale = 0.5;
  gameOverSprite.visible = false

  musicaDeFondo.play();
  musicaDeFondo.setVolume(0.1);
  botonMute = createImg("./Imagenes/Mute.jpg");
  botonMute.position(700,20);
  botonMute.size(40,40);
  botonMute.mousePressed(mute);
  desmuteado = createImg("./Imagenes/desmuteado.jpg");
  desmuteado.mousePressed(playMusic);
  desmuteado.position(650,20);
  desmuteado.size(40,40);
}

function draw() {
  //establecer el color de fondo
  background("white");
  textSize(25)
  text("puntuacion:      "+score,15,20);

  
  //evalua estado del juego
  if(estadoDelJuego == "iniciando"){
    score = 0;
    trex.changeAnimation("etiqueta3");
    trex.x = 54;
    trex.y = 241;
    trex.scale = 0.5;
    ground.velocityX = 0;
    grupoDeNubes.setVelocityXEach(0)
    grupoDeObstaculosDelPiso.setVelocityXEach(0);
    pisoInvisible.visible=false;
    //console.log("si jaa el estado de juego iniciando");
  }
  if(estadoDelJuego == "play"){
    score = score + Math.round(getFrameRate()/60);
    if(score > 0 && score %200 === 0){
      //console.log("si llego xd")
      checkpointSound.play();
      checkpointSound.setVolume(0.1);
      ground.velocityX = ground.velocityX -2
      //velo = velo -3
      //console.log("velocidad"+velo);
    }
  //hacer que el trex salte al presionar la barra espaciadora
  if(keyDown("space") && trex.y >= 150){
    //trex.y = 260
    trex.velocityY=-10
    jumpSound.play();
    jumpSound.setVolume(0.1);
  }
  //agregar gravedad
 trex.velocityY = trex.velocityY + 1;

  //hacer que el piso se repita 
 ground.velocityX = -4;
 if (ground.x < 0){
  ground.x = ground.width/2;
 }

  creacionDeNubes();
  ObstaculosDeSuelo();
  //automaticJump();
  //evitar que el trex caiga
  pisoInvisible.visible=false;
  trex.collide(pisoInvisible);
  if (grupoDeObstaculosDelPiso.isTouching(trex)){
    estadoDelJuego = "end";
    //console.log("si funciono?");
  }
 }
 //final del play
 if (grupoDeObstaculosDelPiso.isTouching(trex)){
   estadoDelJuego = "end";
   //console.log("si se tocaron"+score+"los puntos ALV");
 }

 if(estadoDelJuego == "end"){
  fuegoBase()
  seMurio();
  restartSprite.visible = true
  gameOverSprite.visible = true
  if(mousePressedOver(restartSprite)){
   reset();
  }
 }
  
  //visualiza Sprites
  drawSprites();
}

function reset()
{
  estadoDelJuego = "play";
  gameOverSprite.visible = false;
  restartSprite.visible = false;
  grupoDeNubes.destroyEach();
  grupoDeObstaculosDelPiso.destroyEach();
  trex.changeAnimation("etiqueta2");

  score=0;
}

function creacionDeNubes(){
  if(World.frameCount % 60 === 0) {
    nubes=createSprite(730,50,20,20);
    nubes.addImage("etiqueta3",nubes1);
    nubes.scale=0.1;
    nubes.velocityX = -4
    num = Math.round(random(20,200));
    nubes.y = num;
    nubes.lifetime = 185;
    grupoDeNubes.add(nubes);
  }
  //console.log("no chafio");
}

function ObstaculosDeSuelo(){
  console.log(numImagen);
  if(World.frameCount % 60 === 0) {
    numImagen = Math.round(random(1,6));
    obstaculo=createSprite(730,260,100,500);
    //estructura switch 
    switch(numImagen){
      case 1:obstaculo.addImage("obstaculo1",obstaculo1Imagen);
        break;
          case 2:obstaculo.addImage("obstaculo2",obstaculo2Imagen);
            break;
              case 3:obstaculo.addImage("obstaculo3",obstaculo3Imagen);
                obstaculo.scale=0.3;
                break;
                  case 4:obstaculo.addImage("obstaculo4",obstaculo4Imagen);
                    break;
                      case 5:obstaculo.addImage("obstaculo5",obstaculo5Imagen);
                        break;
                          case 6:obstaculo.addImage("obstaculo6",obstaculo6Imagen);
                            break;
                              default: break;
    }
    obstaculo.scale=0.1;
    obstaculo.depth=trex.depth;
    trex.depth+=1;
    obstaculo.velocityX = -6
    num = Math.round(random(20,200));
    obstaculo.lifetime = 185;
    grupoDeObstaculosDelPiso.add(obstaculo);
  }
}

function automaticJump(){
  if(trex.isTouching(grupoDeObstaculosDelPiso)){
    trex.velocityY=-10;
  }
  trex.velocityY = trex.velocityY + 1;
  //jumpSound.play();
}

function seMurio(){
    trex.velocityX = 0;
    trex.velocityY = 0;
    ground.velocityX = 0;
    grupoDeNubes.destroyEach();
    grupoDeObstaculosDelPiso.destroyEach();
    //dieSound.play();
    trex.changeAnimation("etiqueta1");
    //console.log(score+"texto");
    //firebase2();

}

function mute(){
  console.log("funcion")
  if(musicaDeFondo.isPlaying()){
    musicaDeFondo.stop();
    //trex.changeAnimation("etiqueta1");
  }
}

function playMusic(){
  if(musicaDeFondo.stop){
    musicaDeFondo.play();
  }
}

function fuegoBase(){
  /*const BaseDatos = firebase.database();
  BaseDatos.ref('/score').set({score:score});*/
  //const base_datos = firebase.database();
    const base_datos = firebase.database();
    base_datos.ref('/score').set({
    score:score})
    //console.log("entra base de datos");
}

function nombreDelJugador(){
  estadoDelJuego = "play"
  var nombreJugador = document.getElementById("UserName").value
  console.log("nombreDelJugador" + nombreJugador);
  const base_datos = firebase.database();
    base_datos.ref('/nombreJugador').set({
      nombreJugador:nombreJugador})
}