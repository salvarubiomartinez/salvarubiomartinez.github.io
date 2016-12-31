//var Rx = require('rxjs/Rx');
const timer = Rx.Observable.interval(3000);

const click = Rx.Observable.fromEvent(document, 'click').startWith('start click');
const seq = Rx.Observable.interval(10);
const clicks = Rx.Observable.merge(click, seq);

const getCoord = (seq, witdh) => {
        const goBack = parseInt(seq / window[witdh]);
        if (goBack % 2 == 0) {
            return seq % window[witdh];
        } else {
            const diff = seq % window[witdh];
            return window[witdh] - diff;
        }
};

const bubble = Rx.Observable.interval(10)
    .map(x => { return { x : getCoord(x, "innerWidth"), y : getCoord(x, "innerHeight")}});

const bubbleWithMouse = Rx.Observable.zip(bubble, clicks, function (firstStreamItem, secondStreamItem) {
    return { bubble: firstStreamItem, mouse: secondStreamItem };
}).takeWhile(obj => {
    if (obj.mouse.clientX){
        const x = obj.bubble.x - obj.mouse.clientX;
        const y = obj.bubble.y - obj.mouse.clientY;
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        return distance > 20;
    } else {
        return true;
    }
}); 

const printBubble = (name) => {
    var div = document.createElement("div");
    var contenido = document.createTextNode(name);
    div.appendChild(contenido);
    div.setAttribute("class", "star");
    document.getElementById('body').appendChild(div);
    div.style.background = 'green';
    div.style.width = '20 px';
    div.style.height = '20 px';
    return div;
}

timer.subscribe((number) => {
    var div = printBubble(number);
    bubbleWithMouse.subscribe(
    position => {
        div.style.left = position.bubble.x + 'px';
        div.style.top = position.bubble.y + 'px';
    },
    null, 
    () => {
        div.setAttribute( "hidden", true);
        console.log("dead");
    }
    );
});

