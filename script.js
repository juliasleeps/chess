console.clear();
var COLOR_1 = '#F9E9D0'; //светлый
var COLOR_2 = '#AC7D61'; //темный
var chessboard = document.getElementById('chessboard');
var cells = null;
var images = null;
var isDown = false;
var initialPosition = null;
var img = document.createElement('img');
var img_1 = document.createElement('img');
var imgCoords = null;
var cellWidth = null;


//Style
chessboard.style.width = (window.innerHeight * 0.7) + 'px';
chessboard.style.height = chessboard.style.width;
cellWidth = parseInt(chessboard.style.width) / 8 + 'px';

function editImg(_img){
    _img.style.width = parseInt(cellWidth) * 0.8 + 'px';
    _img.style.position = 'absolute';
    _img.style.margin = parseInt(cellWidth) * 0.1 + 'px';
}

// создание доски
for (var i=0; i< 64; i++){
    var div = document.createElement('div');
    div.style.width = parseInt(cellWidth) + 'px';
    div.style.height = div.style.width;
    div.style.float = 'left';
    if(parseInt((i / 8) + i) % 2 == 0){
        div.style.backgroundColor = COLOR_1;
    } else{
        div.style.backgroundColor = COLOR_2;
    }
    chessboard.appendChild(div);
}

//  initial position фигур
cells = document.querySelectorAll('div > div');

for(var i = 0; i < cells.length; i++){
    if(i < 16 || i > 47){
       var img = document.createElement('img');
        editImg(img);
        cells[i].appendChild(img);
    } 
}
images = document.querySelectorAll('img');
for(var i = 8; i < 16; i++){
    images[i].src = 'img/bP.png';
}
for(var i = 16; i < 24; i++){
    images[i].src = 'img/wP.png';
}
images[0].src = 'img/bR.png';
images[7].src = 'img/bR.png';
images[1].src = 'img/bN.png';
images[6].src = 'img/bN.png';
images[2].src = 'img/bB.png';
images[5].src = 'img/bB.png';
images[3].src = 'img/bQ.png';
images[4].src = 'img/bK.png';
images[24].src = 'img/wR.png';
images[31].src = 'img/wR.png';
images[25].src = 'img/wN.png';
images[30].src = 'img/wN.png';
images[26].src = 'img/wB.png';
images[29].src = 'img/wB.png';
images[27].src = 'img/wQ.png';
images[28].src = 'img/wK.png';


// EventListener для фигур

for (var i=0; i< images.length; i++){
    images[i].addEventListener('mousedown',function(event){
        var self = this;
        isDown = true;
        imgCoords = getCoords(self);
        var shiftX = event.pageX - imgCoords.left;
        var shiftY = event.pageY - imgCoords.top;
        var newPlace = null;
        self.style.zIndex = 1; // чтобы текущая фигура была выше остальных и отрабатывала нормально логика с возвратом фигуры
        //если пытаемся поместить в непустое поле. на onmouseup обнуляем zIndex
    
        // перемещаем по экрану
        document.addEventListener('mousemove', moveFun = function(event){
            moveAt(event, self, shiftX, shiftY);
        })
    
        // отследить окончание переноса
        self.onmouseup = function(event) {
            isDown = false;
            newPlace = getCoords(self)
            self.style.zIndex = 0;
    
            // находим координаты центра картинки
            var destination = {
                top: (newPlace.bottom - newPlace.height / 2),
                left: (newPlace.right - newPlace.width / 2)
            }
            // если центр картинки находится в одном из дивов - аппендим картинку в этот див   
            for(var cell of cells){
                var cellCoords = getCoords(cell);
                if(destination.top >= cellCoords.top 
                && destination.top <= cellCoords.bottom 
                && destination.left >= cellCoords.left 
                && destination.left <= cellCoords.right){
                    self.style.margin = null;
                    if(!cell.childNodes.length){ //если поле уже занято - фигура вернется на место
                        cell.appendChild(self);
                        self.style.top = cellCoords.bottom - (cellCoords.height + newPlace.height) / 2 + 'px';
                        self.style.left = cellCoords.right - (cellCoords.width + newPlace.width) / 2 + 'px';
                        
                    } else{ 
                        self.style.top = imgCoords.top + 'px';
                        self.style.left = imgCoords.left + 'px';
                    }
                }
            }       
    
            // очищаем EventListener 
            document.removeEventListener('mousemove', moveFun)
            self.onmouseup = null;
        }
          
    })
}

// удаление дефолтного ивента браузера
for (i = 0; i < images.length; i++){
    images[i].ondragstart = function() {
        return false;
    };     
}

// ФУНКЦИИ

// функция мува элемента
function moveAt(e, image, shiftX, shiftY) {
    if(isDown){
        image.style.left = e.pageX - shiftX + 'px';
        image.style.top = e.pageY - shiftY + 'px';  
    }
  }

// функция для определения координат
function getCoords(elem) {
  var coordsOfElem = elem.getBoundingClientRect();
  return {
    top: coordsOfElem.top + pageYOffset,
    left: coordsOfElem.left + pageXOffset,
    bottom: coordsOfElem.bottom,
    right: coordsOfElem.right,
    height: coordsOfElem.height,
    width: coordsOfElem.width,
  };
}



// if(isDown){
//     chessboard.onmouseover = function(event) {
//         var target = event.target;
//         var prevColor = target.style.backgroundColor;
//         console.log(target.tagName);
//         if(target.tagName == 'DIV'){
//             target.style.background = 'pink';
//             chessboard.onmouseout = function(event) {
//             target.style.background = prevColor;
//             }
//         }
//     }
// };