import {canva,ctx} from "./modules/canva.js"
import { getRandomInt } from "./modules/randomInt.js"

let grass = new Image()
grass.src = `./assets/Ground/Grass.png`

let cliff = new Image()
cliff.src = `./assets/Ground/Cliff.png`

let g = {cell:20,map:[],collapse:true,genSpeed:10}
let rules = [
    {cant:[2],id:"grass",color:"green",index:0},
    {cant:[3],id:"sand",color:"yellow",index:1},
    {cant:[0,3],id:"water",color:"blue",index:2},
    {cant:[1,2],id:"stone",color:"dark",index:3}
]
const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function cantUpdate(cell){
    let cant = []
    cell.value.forEach(function(item,i){
        cant.push([])
        rules[cell.value[i]].cant.forEach((value)=>{
            cant[i].push(value)
        })
    })
    let result = cant.reduce((a, b) => a.filter(c => b.includes(c)));
    return result
}

let pool = []
function createMap(){
    for (let i = 0;i<canva.width;i+=g.cell){
        g.map.push([])
        for (let j = 0;j<canva.height;j+=g.cell){
            g.map[i/g.cell].push({x:i,y:j,value:[0,1,2,3],collasped:false,color:"red",expand:false})
        }
    }
    g.map.forEach((xCell)=>{
        xCell.forEach((cell)=>{
            pool.push(cell)
    })
}) 
}

function drawGrid(map){
    g.map.forEach((xCell)=>{
        xCell.forEach((item)=>{
            ctx.strokeRect(item.x,item.y,g.cell,g.cell)
            if(item.collasped == true) {
                ctx.globalAlpha = 1;
                if (item.color == "green" ||item.value[0] == 0) ctx.drawImage(grass, 16, 0, 16, 16, item.x, item.y, g.cell, g.cell) 
                else if (item.color == "yellow" || item.value[0] == 1) ctx.drawImage(grass, 64, 0, 16, 16, item.x, item.y, g.cell, g.cell)
                else if (item.color == "blue" || item.value[0] == 2) ctx.drawImage(grass, 0, 0, 16, 16, item.x, item.y, g.cell, g.cell)
                else if (item.color == "grey" || item.value[0] == 3) ctx.fillRect(item.x,item.y,g.cell,g.cell)
            }else {
                ctx.globalAlpha = 1;
                item.value.forEach(element => {
                    if (element == 0) ctx.drawImage(grass, 16, 0, 16, 16, item.x, item.y, 5, 5) 
                    else if (element == 1) ctx.drawImage(grass, 64, 0, 16, 16, item.x+5, item.y, 5, 5)
                    else if (element == 2) ctx.drawImage(grass, 0, 0, 16, 16, item.x+10, item.y, 5, 5)
                    else if (element == 3) ctx.fillRect(item.x,item.y+5,5,5)
                });
            }
        })
    })
}

function updateEntropy(cell){
    let neighbors = []
    for (const [dx, dy] of directions) {
        const x = cell.x/g.cell + dx;
        const y = cell.y/g.cell + dy;
        if (x >= 0 && x < canva.width/g.cell && y >= 0 && y < canva.height/g.cell) {
            neighbors.push(g.map[x][y]);
        }
    }
    let cant = []
    console.log(cell.value)
    cell.value.forEach(function(item,i){
        rules[cell.value[0]].cant.forEach((value)=>{
            cant.push(value)
        })
    })
    cant = cantUpdate(cell)
    if (cant.length == 0 ||neighbors.length == 0) return
    neighbors.forEach((voisin)=>{
        if (voisin.collasped == false  && voisin.expand == false && voisin.value.length != 1){
            for (let i = 0;i< voisin.value.length;i++){
                let item = voisin.value[i]
                for (let g = 0;g< cant.length;g++){
                    let cantItem = cant[g]
                    if (item == cantItem){
                        voisin.value.splice(i,1)
                        i --
                    }
                }
            }
        } 
    })
    if (cant.length == 0) return
    neighbors.forEach((voisin)=>{
        if ( voisin.expand == false){
            updateEntropy(voisin)
            voisin.expand = true
        }
    })
}

function collapseCell(i){
    pool.forEach((item)=>{
        item.expand = false
    })
    pool = pool.filter(item => (
        !item.collasped
    ));
    pool.sort(function(a, b) {
        return a.value.length - b.value.length;
    });

    let result 
    if (i = 1) result = pool[Math.floor(Math.random()*pool.length)]
    else result = pool[0]

    result.collasped = true
    result.value = [result.value[getRandomInt(0,result.value.length-1)]]
    result.color = rules[result.value[0]].color
    updateEntropy(result)
}

let i = 0
function animate(){
    ctx.clearRect(0,0,canva.width,canva.height)
    drawGrid(g.map)
    //if (i <= ( (canva.width/g.cell)**2 )-1){
    //    for (let h = 0;h< g.genSpeed;h++){
    //        i++
    //        collapseCell(i)
    //    }
    //}
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 0);
}
createMap()
animate()

// function to calculate angle of a vector in radians
window.addEventListener("keydown",(e)=>{  
    if (e.code == "Space"){
        collapseCell(i)
        i ++
    }
})

            //voisin.value.forEach(function(item,i){
            //    cant.forEach(function(cantItem,g){
            //        console.log(cantItem,item)
            //        if (item == cantItem){
            //            voisin.value.splice(i,1)
            //            console.log("suppr")
            //        }
            //    })
            //})