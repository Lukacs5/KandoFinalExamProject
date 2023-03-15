var http  = require('http').createServer(handler); //egy szervert függvény kezelővel hoz létre
var fs    = require('fs'); //file rendszerekért felelős modul igénylése
var io    = require('socket.io')(http) //kér egy socket.iot és azt átadja a http nek


var Gpio  = require('onoff').Gpio; //meghívom az onoff modult
var LED4  = new Gpio(4, 'out'); //a raspberry 4 es kivezetését használom kimenetnek
var LED17 = new Gpio(17, 'out'); 
var LED27 = new Gpio(27, 'out');
var LED18 = new Gpio(18, 'out'); 
var LED22 = new Gpio(22, 'out'); 
var LED23 = new Gpio(23, 'out'); 
var LED24 = new Gpio(24, 'out'); 
var pushButton5 = new Gpio(5, 'in', 'both'); //pi 5 kivezetés 'in'(input)bemenetre állítom, és 'both' button presses, and releases should be handled
var pushButton6 = new Gpio(6, 'in', 'both');
var pushButton13 = new Gpio(13, 'in', 'both');
var pushButton19 = new Gpio(19, 'in', 'both');
var pushButton26 = new Gpio(26, 'in', 'both');
var pushButton21 = new Gpio(21, 'in', 'both');
var pushButton20 = new Gpio(20, 'in', 'both');


http.listen(8080); //a 8080 port figyelése


function handler (req, res) { //készít egy http szerert
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //beolvassa az index htmlt a 

    if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'}); //nincs meg a html error dobunk
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'}); //beleírjuk a htmlt
      
      res.write(data); //kikuldjuk az oldalt 
      return res.end();
    });
  }
  
  
  io.sockets.on('connection', function (socket) {// kapcsolódunk a web sokethez
    var lightvalue = 0; //be állítom a light value értéket 0 ra
    function twoname(pushButtonx,LEDx,lightx){
    pushButtonx.watch(function (err, value) { //vizsgáljuk hogy a gombe meg van e 
      if (err) { //ha nincs error
        console.error('There was an error', err); //küldünk egy errort
        return;
      }
      
      lightvalue = value;//pushButtonx value legyen egyenlő a lightvalue
      
      socket.emit(lightx, lightvalue); //gomb állapotának küldése a kliensnek
    });
    socket.on(lightx, function(data) { //ha az érték light(világít)
      lightvalue = data;
      if (lightvalue != LEDx.readSync()) { //csak akkor változtatja meg a led állapotát ha az eltér
        
        LEDx.writeSync(lightvalue); //ledet be vagy kikapcsolja
      }
      
    });}
    twoname(pushButton5,LED4,'light0');
    twoname(pushButton6,LED17,'light1');
    twoname(pushButton13,LED27,'light2');
    twoname(pushButton19,LED22,'light3');
    twoname(pushButton26,LED18,'light4');
    twoname(pushButton20,LED23,'light5');
    twoname(pushButton21,LED24,'light6');
  });
  
  
  process.on('SIGINT', function () {
    LED4.writeSync(0); // kikapcsolja a ledet
    LED17.writeSync(0);
    LED18.writeSync(0);
    LED27.writeSync(0);
    LED22.writeSync(0);
    LED23.writeSync(0);
    LED24.writeSync(0);
      LED4.unexport(); // visszaállitja a gpiot
      LED17.unexport();
      LED18.unexport();
      LED27.unexport();
      LED22.unexport();
      LED23.unexport();
      LED24.unexport();
        pushButton5.unexport(); // visszaállitja a gpiot
        pushButton6.unexport();
        pushButton13.unexport();
        pushButton19.unexport();
        pushButton26.unexport();
        pushButton21.unexport();
        pushButton20.unexport();
    process.exit(); //és bezárja a node ot
  });
  