var canvas = document.getElementById("star-canvas"),
    ctx = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight,
    PLUS = 187,
    MINUS = 189,
    STOP = 80,
    eraseColor = "#999",
    textNode = document.getElementById("text");
(function(arr){
    arr.forEach(function(canvas){
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        canvas.style.width = width;
        canvas.style.height = height;
    });
})([canvas]);

function bind(what, events, fn){
    var bindFn = function(evt){
        what.addEventListener(evt, fn);
    };
    events.forEach(bindFn);
}

function Star() {
    this.angle = Math.floor(Math.random() * 360);
}
textNode.className = "fadeOut";
bind(textNode, ['webkitTransitionEnd', 'transitionend'], function(e){
    textNode.parentNode.removeChild(textNode);
});

Star.prototype = {
    x : Math.round(width / 2),
    y : Math.round(height / 2),
    speed : 1,
    radius : 1,
    getColor : function(fillColor){
        var fill = fillColor || 255,
            step = Math.floor((255 / 360) * this.angle),
            idx = Math.floor((3 / 360) * this.angle),
            arr = [fill, fill, fill,this.speed / 10];
        arr[idx -1] = step;
        return "rgba(" + arr.join(",") + ")";
    },
    draw : function(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.arc(0, 0, Math.round(this.radius), 0, 2 * Math.PI);
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.getColor(230);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    },
    erase : function(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.lineWidth = 12;
        ctx.fillStyle = eraseColor;
        ctx.strokeStyle =  eraseColor;
        ctx.arc(0,0,Math.round(this.radius + 1), 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    },
    move : function(){
        this.erase();
        this.x += Math.round(this.speed * Math.sin(this.angle * Math.PI / 180));
        this.y += Math.round(this.speed * Math.cos(this.angle * Math.PI / 180));
        this.speed += game.speedMultiplier;
        this.radius += game.radiusMultiplier;
        if(this.x < 0 || this.x > width || this.y < 0 || this.y > height){
            this.x = game.midX;
            this.y = game.midY;
            this.angle = Math.floor(Math.random() * 360);
            this.radius = 1;
            this.speed = 1;
        }
        this.draw();
    }

};
var game = {
    midX : Math.round(width / 2),
    midY : Math.round(height / 2),
    speedMultiplier :.1,
    radiusMultiplier :.1,
    angle : 0,
    incSpeed : function(){
        game.speedMultiplier += .1;
        game.radiusMultiplier += .1;
    },
    decSpeed : function(){
        game.speedMultiplier -= .1;
        game.radiusMultiplier -= .1;
        if(game.speedMultiplier < .1 || game.radiusMultiplier < .1){
            game.speedMultiplier = .1;
            game.radiusMultiplier = .1;
            clearInterval(game.speedHandler);
            delete game.speedHandler;
        }
    }
};

ctx.fillStyle = eraseColor;
ctx.fillRect(0,0, width, height);
var stars = [];

document.addEventListener('keydown', function(e){
    console.log("e code", e.keyCode);
    switch(e.keyCode){
        case PLUS:
            for(var i = 0; i++; i < 5){
                stars.push(new Star());
            }
            break;
        case MINUS:
            for(var i = 0; i < 5; i++){
                stars[i].erase();
            }
            stars.splice(0,5);
            break;
        case 32:
            if(game.abort) delete game.abort;
            else game.abort = true;
    }
});

document.addEventListener('mousemove', function(e){
    game.midX = e.clientX;
    game.midY = e.clientY;
});

document.addEventListener('mousedown', function(e){
    if(game.speedHandler){
        clearInterval(game.speedHandler);
        delete game.speedHandler;
    }
    game.speedHandler = setInterval(game.incSpeed, 50);
});

document.addEventListener('mouseup', function(e){
    if(game.speedHandler){
        clearInterval(game.speedHandler);
        delete game.speedHandler;
    }
    game.speedHandler = setInterval(game.decSpeed, 25);
});

function animate(){
    if(!game.abort){
    stars.forEach(function(star){
        star.move();
    });
    }
    requestAnimationFrame(animate);
}
for(var i = 0; i < 150; i++){
    stars.push(new Star());
}

requestAnimationFrame(animate);