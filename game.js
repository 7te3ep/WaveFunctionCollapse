// IMPORTS
import {canva,ctx} from "./modules/canva.js"
import { drawGrid ,createMap } from "./modules/drawGrid.js"
import { randInt } from "./modules/randomInt.js"
import { rLen,randArr } from "./modules/arrayTools.js"


// VARS
// cell template {x:x,y:y,entropy:["water","sand","grass","rock"],collasped:false,layer:0}
let g = {cell:5,map:[],collapse:true,genSpeed:100}
let rules = {
    "grass":{cant:["water","deep","sand"],id:1,color:"darkgreen"},
    "sand":{cant:["rock","deep","grass"],id:2,color:"yellow"},
    "water":{cant:["rock","grass","land"],id:3,color:"blue"},
    "rock":{cant:["sand","water","deep","land"],id:4,color:"black"},
    "deep":{cant:["sand","rock","grass","land"],id:5,color:"darkblue"},
    "land":{cant:["rock","deep","water"],id:6,color:"green"}
}

// TOOLS

function collapse(map,ctr){
    let pool = []
    map.forEach((x)=>{ x.forEach((cell)=>{
        cell.layer = undefined
        pool.push(cell)
    })})
    pool = pool.filter(item => (!item.collasped));
    pool.sort(function(a, b) {return a.entropy.length - b.entropy.length;});
    if (pool.length == 0) return

    let choice = pool[randInt(0,pool.length/10)]
    if (ctr ==0) choice = randArr(pool)
    choice.layer = 0
    choice.collasped = true
    choice.entropy = [randArr(choice.entropy)] 

    let canContinu = true
    let i = 0
    while (canContinu == true){
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
            if (neighbor.layer == undefined && deleteValues.length != 0)neighbor.layer = cell.layer + 1

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
    if (ctr == 0) ctr ++

    for (let i = 0;i <g.genSpeed;i++){ collapse(g.map,ctr) }
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1);
}


// RUN
createMap()
animate()

export {ctx,rules,g}