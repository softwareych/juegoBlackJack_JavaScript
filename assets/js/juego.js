const miModulo = (() => {
    'use strict';//proteje el codigo para que no sea manipulado por el DOM

    let deck=[];
    const tipos      = ['C','D','H','S'], /**ESTAN EN INGLES, SERÍAN CORAZONES, ESPADAS, ETC */
          especiales = ['A','J','Q','K']; /**LAS QUW FALTAN J, Q, KING Y AS */

    //let puntosJugador = 0,
    //    puntosComputadora = 0;
    //optimizo:
    let puntosJugadores = [];

    //Referencias al html
    const btnPedir   = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo   = document.querySelector('#btnNuevo');

    //const divCartasJugador     = document.querySelector('#jugador-cartas'),
    //      divCartasComputadora = document.querySelector('#computadora-cartas'),
    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML         = document.querySelectorAll('small');

    const inicializarJuego = ( numJugadores = 2 ) => {//inicializa la funcióm, por defecto dos jugadores
        deck = crearDeck();

        puntosJugadores = [];
        for( let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);//push agrega al arreglo inicializando a 0 a cada jugador
        }

        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        btnPedir.disabled   = false;
        btnDetener.disabled = false;        
    }

    const crearDeck =() =>{/**funcion genera el juego de cartas barajeados*/

            for(let i =2;i<=10;i++){
                for(let tipo of tipos){
                    deck.push(i+tipo);
                }            
            }

            for(let tipo of tipos){
                for(let esp of especiales){
                    deck.push(esp+tipo);
                }            
            }
            //deck= _.shuffle( deck );
            //console.log(deck);
            return _.shuffle( deck );
    }

    //esta funcion permite tomar una carta
    const pedirCarta = () => {
        if (deck.length===0){
            throw 'No hay cartas en el deck';
        }
        //console.log('arreglo antes : ' + deck);
        //const carta = deck.pop();//asigna el valor seleccionado del utlimo y luego lo elimina del array

        //console.log('arreglo despues: ' + deck);
        //console.log ('carta ' +  carta );
        return deck.pop();
    }

    const valorCarta= ( carta ) => {//obtiene valor de la carta
        //const valor = carta[0];//no sirve cuando viene el 10J por ejemplo
        const valor = carta.substring(0, carta.length-1);
    // let puntos = 0;
    
    /** reducir este codigo en operador ternario
        *  if( isNaN( valor )){//verifica si es o no un nro
        console.log({valor} + ' no es un nro');  
        puntos = ( valor === 'A') ? 11 : 10;//si es AS es 11 si es j,q,k es 10ptos

        }else {
            console.log({valor} + ' si es un nro'); 
            puntos = valor * 1;
        }*/
        //optimiza alcodigo anterior
        return (isNaN( valor) ) ? 
            ( valor === 'A') ? 11 : 10
            : valor * 1;

        console.log( valor );//cuando en la consola el valor es morado esp q no se a asignado si es gris es string

    }

    const acumularPuntos = (carta, turno) => {//turno: 0 primer jugador, y el último será la computadora

        puntosJugadores[turno]  = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];

    }

    const crearCarta = ( carta, turno ) =>{
            const imgCarta = document.createElement('img');
            imgCarta.src =`assets/cartas/${ carta }.png`;//ojo
            imgCarta.classList.add('carta');
            divCartasJugadores[turno].append( imgCarta);
           // divCartasComputadora.append( imgCarta);        
    }

    const determinarGanador = () => {

        const [ puntosMinimo, puntosComputadora] = puntosJugadores;
        setTimeout(() =>{
            if( puntosComputadora === puntosMinimo ){
                alert('Nadie gana :(');
            }else if(  puntosMinimo > 21 ){
                alert('Computadora gana :(');
            }else if( puntosComputadora > 21){
                alert('Jugador gana :)');
            }else {
                alert('Computadora gana :)'); 
            }
        }, 70 ); //este if se ejecutara 10 milisegundos despues, ya que js no es multihilo y sino no se ponde el msj aparece antes de que juege la computadora

    }
    // turno de la computadora
    const turnoComputadora = ( puntosMinimo ) => {

        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();

            //esto abajo esreempalzado por la funcion acumularPuntos
            //puntosComputadora = puntosComputadora + valorCarta( carta );
            //puntosHTML[1].innerText = puntosComputadora;//coloca el nuevo valor en pantalla
            puntosComputadora = acumularPuntos( carta, puntosJugadores.length-1 );
            crearCarta( carta, puntosJugadores.length-1);

            //crear una carta dinamicamente
            //<img class="carta" src="assets/cartas/3C.png">

            //const imgCarta = document.createElement('img');
            //imgCarta.src =`assets/cartas/${ carta }.png`;//ojo
            //imgCarta.classList.add('carta');
            //divCartasComputadora.append( imgCarta);

           // if( puntosMinimo > 21){
          //      break;
            //}
        } while( (puntosComputadora <  puntosMinimo) && ( puntosMinimo <= 21 ) );
        
        determinarGanador();

    }
    //const valor = valorCarta(pedirCarta());
    //console.log({ valor });

    //Eventos
    //btnPedir.addEventListener('click', function() {});//llamar a una función como argumento dentro de otra se llama Callback puede ser esta funcion tradicional o funcion de flecha como la de abajo
    btnPedir.addEventListener('click', () => {//cuando se haga click en ese boton se disparara la funcion flecha
        
        const carta = pedirCarta();
       
        //esto abajo esreempalzado por la funcion acumularPuntos
        //puntosJugador = puntosJugador + valorCarta( carta );
        //puntosHTML[0].innerText = puntosJugador;//coloca el nuevo valor en pantalla
        const puntosJugador = acumularPuntos( carta, 0 );
    

        //crear una carta dinamicamente
        //<img class="carta" src="assets/cartas/2C.png">

        crearCarta( carta, 0);
       // const imgCarta = document.createElement('img');
        //imgCarta.src =`assets/cartas/${ carta }.png`;//ojo
       // imgCarta.classList.add('carta');
       // divCartasJugador.append( imgCarta);

        console.log( 'puntosJugador ' + puntosJugador );

        if(puntosJugador>21){
            console.warn('Se paso de 21. Perdiste!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            console.log('pasa');
            turnoComputadora( puntosJugador );
        }else if(puntosJugador===21){
            console.warn('21, Ganaste!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            console.log('pasa 2');
            turnoComputadora( puntosJugador );
        }

    

    });

    //turnoComputadora( 12 );

    btnDetener.addEventListener('click', () =>{
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComputadora( puntosJugadores[0] );
    });

    btnNuevo.addEventListener('click', () =>{

       // console.clear();
        //deck=[];//limpia el arreglo
       // deck = crearDeck();
       inicializarJuego();

       // puntosJugador=0;
        //puntosComputadora=0;

       // puntosHTML[0].innerText = 0;
       // puntosHTML[1].innerText = 0;

      //  divCartasComputadora.innerHTML = '';
       // divCartasJugador.innerHTML = '';

       // btnPedir.disabled   = false;
      //  btnDetener.disabled = false;

    });

    //este return se coloca al final del patrón módulo, y todo lo que esté allí será público , no estara privado
    return {
       nuevoJuego : inicializarJuego//la función inicializarJuego será conocida en el html como nuevoJuego
    }
})();