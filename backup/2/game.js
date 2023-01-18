// IMPORTS
import {canva,ctx} from "./modules/canva.js"
import { drawGrid ,createMap } from "./modules/drawGrid.js"
import { randInt } from "./modules/randomInt.js"
import { rLen,randArr } from "./modules/arrayTools.js"

let villageImg = new Image()
villageImg.source = "./assets/Buildings/Wood/Barracks.png"

// VARS
// cell template {x:x,y:y,entropy:["water","sand","grass","rock"],collasped:false,layer:0}
let g = {cell:5,map:[],collapse:true,genSpeed:100,finished:false,prop:10}

let rules = {
    "grass":{cant:["boat","water","deep","sand","shore","mount"],id:1,color:"darkgreen",weight:2},
    "sand":{cant:["boat","rock","deep","grass","village","water","mount","field"],id:2,color:"rgb(247, 255, 132)",weight:1},
    "water":{cant:["rock","grass","land","village","sand","mount","field"],id:3,color:"rgb(42, 90, 174)",weight:2},
    "rock":{cant:["boat","sand","water","deep","land","village","shore","field"],id:4,color:"rgb(131, 131, 131)",weight:2},
    "deep":{cant:["boat","sand","rock","grass","land","village","shore","mount","field"],id:5,color:"rgb(30, 30, 160)",weight:1},
    "land":{cant:["boat","rock","deep","water","shore","mount","field"],id:6,color:"rgb(14, 153, 26)",weight:1},
    "village":{cant:["boat","rock","deep","water","sand","shore","mount"],id:7,color:"rgb(150, 85, 0)",weight:1},
    "shore":{cant:["boat","rock","deep","village","grass","land","mount","field"],id:8,color:"rgb(85, 151, 221)",weight:1},
    "mount":{cant:["boat","sand","water","deep","land","village","shore","grass","field"],id:9,color:"rgb(68, 68, 68)",weight:1},
    "field":{cant:["boat","sand","water","deep","land","shore","rock"],id:10,color:"yellow",weight:1},
    "boat":{cant:["boat","grass","sand","rock","deep","land","village","shore","mount","field"],id:11,color:"red",weight:1},
}
//["grass","sand","water","rock","deep","land","village","shore","mount","field","boat"]
// TOOLS

function collapse(map,ctr){
    let pool = []
    map.forEach((x)=>{ x.forEach((cell)=>{
        cell.layer = undefined
        pool.push(cell)
    })})
    pool = pool.filter(item => (!item.collasped));
    pool.sort(function(a, b) {return a.entropy.length - b.entropy.length;});
    if (pool.length == 0) {
        g.finished = true
        return
    }

    let choice = pool[randInt(0,pool.length/10)]
    if (ctr ==0) choice = randArr(pool)
    choice.layer = 0
    choice.collasped = true
    choice.entropy = [randArr(choice.entropy)] 

    let canContinu = true
    let i = 0

    while (canContinu == true && i < g.prop){
        canContinu = false
        pool.forEach(function(item){
            if (item.layer == i){
                updateEntropy(item)
                canContinu = true
            }
        })
        i ++
    }
}

function updateEntropy(cell){
    let deleteValues = cantUpdate(cell)
    let neighbors = []
    if (g.map[cell.x/g.cell-1] != undefined && g.map[cell.x/g.cell-1][cell.y/g.cell] != undefined) neighbors.push(g.map[cell.x/g.cell-1][cell.y/g.cell])
    if (g.map[cell.x/g.cell+1] != undefined && g.map[cell.x/g.cell+1][cell.y/g.cell] != undefined)neighbors.push(g.map[cell.x/g.cell+1][cell.y/g.cell])
    if (g.map[cell.x/g.cell] != undefined && g.map[cell.x/g.cell][cell.y/g.cell - 1] != undefined)neighbors.push(g.map[cell.x/g.cell][cell.y/g.cell-1])
    if (g.map[cell.x/g.cell] != undefined && g.map[cell.x/g.cell][cell.y/g.cell + 1] != undefined)neighbors.push(g.map[cell.x/g.cell][cell.y/g.cell+1])

    if (g.map[cell.x/g.cell+1] != undefined && g.map[cell.x/g.cell+1][cell.y/g.cell + 1] != undefined)neighbors.push(g.map[cell.x/g.cell+1][cell.y/g.cell+1])
    if (g.map[cell.x/g.cell+1] != undefined && g.map[cell.x/g.cell+1][cell.y/g.cell - 1] != undefined)neighbors.push(g.map[cell.x/g.cell+1][cell.y/g.cell-1])
    if (g.map[cell.x/g.cell-1] != undefined && g.map[cell.x/g.cell-1][cell.y/g.cell + 1] != undefined)neighbors.push(g.map[cell.x/g.cell-1][cell.y/g.cell+1])
    if (g.map[cell.x/g.cell-1] != undefined && g.map[cell.x/g.cell-1][cell.y/g.cell - 1] != undefined)neighbors.push(g.map[cell.x/g.cell-1][cell.y/g.cell-1])
    neighbors.forEach((neighbor)=>{
        if (!neighbor.collasped){
            let len = neighbor.entropy.length
            if (neighbor.layer == undefined && deleteValues.length != 0) neighbor.layer = cell.layer + 1

            for (let i = 0; i < len; i++) {
                if (deleteValues.includes(neighbor.entropy[i])){
                    neighbor.entropy.splice(i,1)
                    i--
                    len--
                }
            }
        } 
    })
}

function cantUpdate(cell){
    let cant = []
    // rules[cell.entropy[0]].cant
    cell.entropy.forEach(function(item,i){
        cant.push([])
        rules[item].cant.forEach((value)=>{
            cant[i].push(value)
        })
    })
    let result = cant.reduce((a, b) => a.filter(c => b.includes(c)));
    return result
}

// ANIMATE
let ctr = 0
function animate(){
    ctx.clearRect(0,0,canva.width,canva.height)
    drawGrid(g.map)
    for (let i = 0;i <g.genSpeed;i++){ collapse(g.map,ctr) }
    if (ctr == 0) ctr ++
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1);
}


// RUN
createMap()
animate()

export {ctx,rules,g}