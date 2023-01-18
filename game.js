// IMPORTS
import {canva,ctx} from "./modules/canva.js"
import { drawGrid ,createMap } from "./modules/drawGrid.js"
import { randInt } from "./modules/randomInt.js"
import { rLen,randArr } from "./modules/arrayTools.js"
import {mount0,church0,puit0,tree4,boat0,house0,house1,house2,house3,wheat0,wheat1,wheat2,wheat3,tree0,tree1,tree2,tree3,land0,land1,sand0,sand1,sand2,shoreImg,waterImg,deepImg, rock0,rock1,rock2,rock3} from './imgs.js'
ctx.imageSmoothingEnabled = false;


// VARS
// cell template {x:x,y:y,entropy:["water","sand","forest","rock"],collasped:false,layer:0}
let g = {cell:32,map:[],collapse:true,genSpeed:100,finished:false,prop:10}
if (canva.width > canva.height) g.cell = Math.round(canva.width/40)
else {g.cell = Math.round(canva.height/40)}


let rules = {
    "forest":{cant:["church","puit","boat","water","deep","sand","shore","mount","field"],id:1,color:"darkgreen",weight:2,"img":[tree4,tree4,tree4,tree0,tree1,tree2,tree3]},
    "sand":{cant:["church","puit","boat","rock","deep","forest","village","water","mount","field"],id:2,color:"rgb(247, 255, 132)",weight:1,"img":[sand0,sand0,sand0,sand0,sand0,sand0,sand0,sand0,sand0,sand0,sand0,sand1,sand2]},
    "water":{cant:["church","puit","rock","forest","land","village","sand","mount","field"],id:3,color:"rgb(42, 90, 174)",weight:2,"img":[waterImg]},
    "rock":{cant:["church","puit","boat","sand","water","deep","land","village","shore","field"],id:4,color:"rgb(131, 131, 131)",weight:2,"img":[rock0,rock0,rock0,rock1,rock2,rock3]},
    "deep":{cant:["church","puit","boat","sand","rock","forest","land","village","shore","mount","field"],id:5,color:"rgb(30, 30, 160)",weight:1,"img":[deepImg]},
    "land":{cant:["puit","boat","rock","deep","water","shore","mount"],id:6,color:"rgb(14, 153, 26)",weight:1,"img":[land0,land1]},
    "village":{cant:["puit","sand","water","rock","deep","shore","mount","boat"],id:7,color:"rgb(150, 85, 0)",weight:1,"img":[house0,house1,house2,house3]},
    "shore":{cant:["church","puit","boat","rock","deep","village","forest","land","mount","field"],id:8,color:"rgb(85, 151, 221)",weight:1,"img":[shoreImg]},
    "mount":{cant:["church","puit","boat","sand","water","deep","land","village","shore","forest","field"],id:9,color:"rgb(100, 100, 100)",weight:1,"img":[mount0]},
    "field":{cant:["church","boat","sand","water","deep","forest","shore","rock","mount"],id:10,color:"yellow",weight:1,"img":[wheat0,wheat1,wheat2,wheat3]},
    "boat":{cant:["church","puit","boat","forest","sand","rock","deep","land","village","shore","mount","field"],id:11,color:"red",weight:1,"img":[boat0]},
    "puit":{cant:["church","forest","sand","water","rock","deep","land","village","shore","mount","boat","puit"],id:12,color:"red",weight:1,"img":[puit0]},
    "church":{cant:["forest","sand","water","rock","deep","shore","mount","field","boat","puit","church"],id:13,color:"red",weight:1,"img":[church0]},
}
//["forest","sand","water","rock","deep","land","village","shore","mount","field","boat","puit"]
// TOOLS


function collapse(map,ctr){
    let pool = []
    map.forEach((x)=>{ x.forEach((cell)=>{
        cell.layer = undefined
        pool.push(cell)
    })})
    pool = pool.filter(item => (!item.collasped));
    if (pool.length-1 == 0) {
        g.finished = true
        return
    }
    pool.sort(function(a, b) {return a.entropy.length - b.entropy.length;});


    let choice = pool[randInt(0,pool.length/20)]
    //let choice = pool[0]
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
        if (!neighbor.collasped && neighbor.entropy.length != 0){
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
    if(g.finished) ctr ++
    if (ctr >10) return
    ctx.clearRect(0,0,canva.width,canva.height)
    drawGrid(g.map)
    for (let i = 0;i <g.genSpeed;i++){ collapse(g.map,ctr) }
    if (ctr == 0) ctr ++
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1);
}
// rajouter gros batiment au centre des villages
// rajouter eglise seul dans les montagnes
// rajouter des puit au centre des champs
// rajouter du deplacement avec les fleches du clavier dans la map grace a une 

// RUN
createMap()
console.log(Object.keys(rules))
animate()

export {ctx,rules,g}