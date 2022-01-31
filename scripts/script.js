let main;
let tablero;
let escenario = new Array();

let posiciomMomia = new Array();
//Posiciones del personaje
let xActual;
let yActual;

//Variables momia
let momias

let numeroMomias=0;

//Variables para premios

let pergamino = false;
let sarcofago = false;
let llave = false;
let momiaDespierta = false;
let premiosDisponibles = 20;
let cajascore;
let score =0;

let vidas =5;
let victoria=false;

let level=1;




window.onload = function(){
    main = document.querySelector("main");
    tablero=document.createElement("div");
    cajascore= document.getElementById("score");
    let cajaVidas = document.getElementById("vidas");
    if (sessionStorage.getItem("nivel")!=null){
        level = sessionStorage.getItem("nivel");
        score = parseInt(sessionStorage.getItem("puntos"));
        vidas = sessionStorage.getItem("vidas");
    }
    cajascore.innerText=score;
    

    for (let i = 0; i<vidas;i++){
        let div = document.createElement("div");

        cajaVidas.appendChild(div);
    }

    createField(); 
    iniciar(); 
    addEventListener("keydown",teclaPulsada); 
}

function createField(){
    let hueco = premio =totalpremiosfila= 0;
    main.appendChild(tablero);
    tablero.setAttribute("id", "tablero");
    
    //Creo el escenario del juego
    for (let y = 0; y < 14 ; y++){
        escenario[y] = new Array();
        hueco=0;
        for (let x = 0; x < 21; x++){
            let div = document.createElement("div");
            tablero.appendChild(div);
            escenario[y].push(div);
            
            //Si la linea va vacia
            if (y==1||y==4||y==7||y==10||y==13){
                div.classList.add("camino");
            }else if (y==0&&x!=8){
                div.classList.add("muro");
                
                //Crea la entrada
            }else if (x==8&&y==0){
                div.classList.add("camino");
                div.id="entrada";
            }else{
                //Crea el primer hueco de cada columna
                if(hueco==0){
                    hueco++;
                    div.classList.add("camino");
                    //Crea la fila
                }else if(premio!=3){
                    premio++;
                    totalpremiosfila++;
                    div.classList.add("premio");
                    //al tener tres casillas premiadas restablece las variables para crear un hueco
                    if(premio==3){
                        premio=0
                        hueco=0;
                    }   
                }
            }
        }
    }
    for (let w = 0; w<level;w++){
        let posicion = encontrarCamino();
        generaMomia(posicion.y,posicion.x);
    }
    setInterval(tickMomia,200)


}

function teclaPulsada(element){
    movimiento = element.key;
    mover(movimiento, yActual, xActual);
}

function iniciar(){

    escenario[0][8].id="player";
    escenario[0][8].classList.add("huella");
    yActual=0;
    xActual=8;
}

function mover(movimiento, y, x){
    //Para cada movimiento
    switch (movimiento){
        case "W":
        case "w":
        case "ArrowUp":
            //Evita que se salga de la matriz
            try{
                
                if (escenario[y-1][x].classList.contains("camino")){
                    if (escenario[y-1][x].classList.contains("momia")){
                        vidas--;
                         quitaVida();

                    }
                    escenario[y-1][x].className="camino";
                    escenario[y-1][x].classList.add("huella","huellaup");
                    escenario[y-1][x].id="player";
                    escenario[y][x].id="";
                    escenario[y][x].style.backgroundImage="";
                    escenario[y-1][x].style.backgroundImage="url('img/personaje_arr1.png')";
                    yActual--;
                    CompruebaPremio();
                    //Si la los tres objetos estan desbloqueados se abre la puerta;
                    abrePuerta();
                    
                }               
            }catch (e){    
            }
            break;
        case "D":
        case "d":
        case "ArrowRight":
            try{
                if(escenario[y][x+1].classList.contains("camino")){
                    if (escenario[y][x+1].classList.contains("momia")){
                        vidas--;
                         quitaVida();

                    }
                    //Sobrescribo las clases para que las huellas se cambien y sobreescriban
                    escenario[y][x+1].className="camino";
                    escenario[y][x+1].classList.add("huella", "huellaright");
                    escenario[y][x].id="";

                    escenario[y][x+1].id="player";
                    escenario[y][x].style.backgroundImage="";
                    escenario[y][x+1].style.backgroundImage="url('img/personaje_der2.png')";
                    xActual++;
                    CompruebaPremio();
                    //Si la los tres objetos estan desbloqueados se abre la puerta;
                    abrePuerta();
                    
                }
            }catch (e){     
            }
            break;
        case "s":
        case "S":
        case "ArrowDown":
            try{
                if (escenario[y+1][x].classList.contains("camino")){
                    if (escenario[y+1][x].classList.contains("momia")){
                        vidas--;
                         quitaVida();

                    }
                    escenario[y+1][x].className="camino";
                    escenario[y+1][x].id="player";
                    escenario[y+1][x].classList.add("huella","huelladown");
                    escenario[y][x].id="";
                    escenario[y][x].style.backgroundImage="";
                    escenario[y+1][x].style.backgroundImage="url('img/personaje_ab1.png')";
                    yActual++;
                    CompruebaPremio();
                    //Si la los tres objetos estan desbloqueados se abre la puerta;
                    abrePuerta();
                }
            }catch (e){   
            }
            break;
        case "a":
        case "A":
        case "ArrowLeft":
            try{
                if (escenario[y][x-1].classList.contains("camino")){
                    if (escenario[y][x-1].classList.contains("momia")){
                        vidas--;
                         quitaVida();

                    }
                    escenario[y][x-1].className="camino";
                    escenario[y][x-1].classList.add("huella", "huellaleft");
                    escenario[y][x].id="";
                    escenario[y][x-1].id="player";
                    escenario[y][x].style.backgroundImage="";
                    escenario[y][x-1].style.backgroundImage="url('img/personaje_izq1.png')";
                    xActual--;
                    CompruebaPremio();
                    //Si la los tres objetos estan desbloqueados se abre la puerta;
                    abrePuerta();                    
                }
            }catch (e){
            }
            break;
        default:
    }
    //Si llegas a la posicion de salida con una victoria guardame estos datos
    if (escenario[0][8].id=="player"&&victoria){
        level++;
        sessionStorage.setItem("puntos",score);
        sessionStorage.setItem("nivel",level);
        sessionStorage.setItem("vidas",vidas);
        location.reload();
    }
}

//Funcion que comprueba si todos los elementos adyacetes donde se esconden los premios estan rodeados
function CheckRodeado(y , x){
    //Numero de casillas que tiene un div premiado adyacente con la clase huella
    let contador =0;
    //Posiciones que pueden tener la clase huella respecto a un div de la matriz
    let arriba = arribader = arribaizq = derecha = izquierda = abajo = abajoder = abajoizq= true;


    //Ocho casillas rodean 
    
    for (let i = 0; i < 8 ; i++){

        if(escenario[y-1][x].classList.contains("huella")&&arriba){
            arriba = false;
            contador++;
        }else if(escenario[y][x-1].classList.contains("huella")&&derecha){
            derecha=false;
            contador++;    
        }else if(escenario[y+1][x].classList.contains("huella")&&abajo){
            abajo=false;
            contador++;     
        }else if(escenario[y][x+1].classList.contains("huella")&&izquierda){
            izquierda=false;
            contador++;
        }else if(escenario[y-1][x-1].classList.contains("huella")&&arribader){
            arribader=false;
            contador++;
        }else if(escenario[y+1][x-1].classList.contains("huella")&&abajoder){
            abajoder=false;
            contador++;
        }else if(escenario[y+1][x+1].classList.contains("huella")&&abajoizq){
            abajoizq=false;
            contador++;
        }else if(escenario[y-1][x+1].classList.contains("huella")&&arribaizq){
            arribaizq=false;
            contador++;
        }
        //Devuelve verdadero si el contador es 3 y se trata de una casilla premiada en el medio o si es una de esquina

    }
    return ((contador==3&&escenario[y][x-1].classList.contains("premio")&&escenario[y][x+1].classList.contains("premio"))||(contador==5));
}


function CompruebaPremio(){
//Recorre el tablero y comprueba si hay premio
    for (let y = 0; y < escenario.length; y++){
        for (let x = 0; x < escenario[y].length; x++){
            //Si una casilla esta rodeada le anyade la clase Premiado
            if (escenario[y][x].classList.contains("premio")){
                if (CheckRodeado(y,x)){
                    escenario[y][x].classList.add("Premiado");
                }
                if (checkPremio(y,x)){
                    generaPremio(y,x)

                }
            }
        }
    }
}

//Devuelve true si todas las casillas de un bloque estan Premiadas
function checkPremio(y,x){
    return (escenario[y][x].classList.contains("Premiado")&&escenario[y][x-1].classList.contains("Premiado")&&escenario[y][x-2].classList.contains("Premiado")&&
    escenario[y+1][x].classList.contains("Premiado")&&escenario[y+1][x-1].classList.contains("Premiado")&&escenario[y+1][x-2].classList.contains("Premiado"))
}


function generaPremio(y,x){
    //Le aplico la clase al primer bloque de la izquierda
    x-=2;
    let numeroRand = getRandomInt(0,6);
    

    if (numeroRand==5&&(!pergamino||!sarcofago||!llave)){
        if (!pergamino){
            escenario[y][x].className="pergamino";
            pergamino=true;
            premiosDisponibles--;
        }else if (!sarcofago){
            escenario[y][x].className="sarcofago";
            sarcofago=true;
            premiosDisponibles--;
        }else if (!llave){
            escenario[y][x].className="llave";
            llave=true;
            premiosDisponibles--;
 
        }

    }else if (numeroRand==0&&!momiaDespierta){
        //creo un hijo a la momia despierta para hacer la animacion del bottom y que no se descoloque
        let div = document.createElement("div");
        escenario[y+1][x+2].appendChild(div);
        escenario[y+1][x+2].className="momiaDespierta";
        escenario[y+1][x+2].style.position="relative";


        momiaDespierta = true;
        
        premiosDisponibles--;
        setTimeout(function(){
            div.style.bottom="0px" ;
            
        },500);
        setTimeout(function(){
            generaMomia(y+2,x+2);
            div.style.background="black" ;

        },5500);

    }else if (premiosDisponibles<5&&!pergamino){
        escenario[y][x].className="pergamino";
        pergamino=true;
        premiosDisponibles--;

    }else if (premiosDisponibles<5&&!sarcofago){
        escenario[y][x].className="sarcofago";
            sarcofago=true;
            premiosDisponibles--;

    }else if (premiosDisponibles<5&&!llave){
        escenario[y][x].className="llave";
            llave=true;
            premiosDisponibles--;

    }else if (premiosDisponibles<5&&!momiaDespierta){
        let div = document.createElement("div");
        escenario[y+1][x+2].appendChild(div);
        escenario[y+1][x+2].className="momiaDespierta";
        escenario[y+1][x+2].style.position="relative";
        momiaDespierta = true;
        
        premiosDisponibles--;
        setTimeout(function(){
            div.style.bottom="0px" ;
        },500);
        setTimeout(function(){
            generaMomia(y+2,x+2);
            div.style.background="black" ;

        },5500);

    }else if (numeroRand%2==0){
        escenario[y][x].className="tesoro";
        score+=1500;
        cajascore.innerText=score;
        premiosDisponibles--;
    }else{
        //Genero un numero random para el fondo entre 0 y 5
        let numRandPremio=Math.floor(Math.random() * 6);
        escenario[y][x].className="nada";
        escenario[y][x].style.backgroundImage= `url(img/fondo${numRandPremio}.png)`;
        score+=300;
        cajascore.innerText=score;

        premiosDisponibles--;
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    breaK=true;

   
}


function abrePuerta(){

    if (llave&&pergamino&&sarcofago){

        escenario[0][8].className="camino";
        victoria=true;
    }else{
        escenario[0][8].className="muro";
    }
}


function generaMomia(y,x){
    //Si no hay posiciones de momias creadas añade la posicion
        escenario[y][x].classList.add("momia");
}

function encontrarCamino(){
    let y = Math.floor(Math.random()*escenario.length)
    let x = Math.floor(Math.random()*escenario[y].length);
    while (!escenario[y][x].classList.contains("camino")){
 
        y = Math.floor(Math.random()*escenario.length)
        x = Math.floor(Math.random()*escenario[y].length);
    }
    return {x,y}
}

function tickMomia(){

    momias = document.getElementsByClassName("momia");
    
    for (let i = 0; i< momias.length; i++){
        //Cada momia se movera a un tick diferente para que en caso de cruzarse no desaparezca una
        setTimeout(function(){
            mueveMomia(i)
        },i*199);
        
    }
}
//Funcion que mueve la momia
function mueveMomia(i){
    let movimientoMomia = getRandomInt(0,5);

    let entrar=true;

    //Recorro el escenario para buscar donde esta la momia pasada por
    for (let y = 0; y<escenario.length&&entrar;y++){
        for (let x = 0; x<escenario[y].length&&entrar;x++){

            if (escenario[y][x]==momias[i]){
                //try para que no de error al chocar con una momia
                try{
                    while(entrar){
                        if (movimientoMomia==1&&escenario[y-1][x].classList.contains("camino")&&!escenario[y-1][x].classList.contains("momia")){
                            escenario[y][x].classList.remove("momia");
                            escenario[y-1][x].classList.add("momia");
                            entrar=false;
                            if (escenario[y-1][x].id=="player"){
                                vidas--;
                                quitaVida();
                            }   
                        }else if (movimientoMomia==2&&escenario[y][x+1].classList.contains("camino")&&!escenario[y-1][x].classList.contains("momia")){
                            escenario[y][x].classList.remove("momia");
                            escenario[y][x+1].classList.add("momia");
                            entrar=false;
                            if (escenario[y-1][x].id=="player"){
                                vidas--;
                                quitaVida();

                            }     
                        }else if (movimientoMomia==3&&escenario[y+1][x].classList.contains("camino")&&!escenario[y-1][x].classList.contains("momia")){
                            escenario[y][x].classList.remove("momia");
                            escenario[y+1][x].classList.add("momia");
                            entrar=false;
                            if (escenario[y-1][x].id=="player"){
                                vidas--;
                                quitaVida();

                            } 
                        }else if (movimientoMomia==4&&escenario[y][x-1].classList.contains("camino")&&!escenario[y-1][x].classList.contains("momia")){
                            escenario[y][x].classList.remove("momia");
                            escenario[y][x-1].classList.add("momia");
                            entrar=false;
                            if (escenario[y-1][x].id=="player"){
                                vidas--;
                                quitaVida();

                            }      
                        }else{
                            let movimientoMomia = getRandomInt(0,5);
                            entrar=false;
                        }
                    }
                }catch(e){         
                }
            }
        }
    }  
}


function quitaVida(){
    let cajaVidas = document.getElementById("vidas").children;

    cajaVidas[0].remove();

    if (vidas<=0){
        console.log("fin partida")
        finPartida();
        
    }
}
function finPartida(){
    sessionStorage.clear();
    let body = document.body;
    let cuadro = document.createElement("div");
    let mensaje = document.createElement("div");
    let boton= document.createElement("button");
    boton.addEventListener("click", function(){location.reload()});

    body.appendChild(cuadro);
    cuadro.classList.add("cuadro");
    cuadro.appendChild(mensaje);
    cuadro.appendChild(boton);
    mensaje.innerText="Has perdido. Has conseguido "+ score+" puntos.";
    boton.innerText="Haz click aqui para volver a jugar";


}