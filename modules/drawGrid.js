import {ctx,rules,g} from "../game.js"
import { randInt } from "./randomInt.js";




export function drawGrid(map){
    map.forEach((x)=>{
        x.forEach((cell)=>{
            let cValues = cell.entropy
            ctx.globalAlpha = 1;
            if (cValues.length == 1){
        
                if(rules[cValues[0]].img != undefined){
                    if (cell.img == undefined){
                        cell.img = rules[cValues[0]].img[randInt(0,rules[cValues[0]].img.length-1)]
                    }
                    ctx.drawImage(cell.img, 0, 0, 16, 16, cell.x, cell.y, g.cell,g.cell)
                }else {
                    ctx.fillStyle = rules[cValues[0]].color
                    ctx.fillRect(cell.x,cell.y,g.cell,g.cell)
                }
            }else {
                ctx.globalAlpha = 0.2;
                cValues.forEach((value,i)=>{
                    ctx.fillStyle = rules[value].color
                    ctx.fillRect(cell.x+i*g.cell,cell.y,g.cell,g.cell)
                })
            }
        })
    })
}

export function createMap(){
    for (let x = 0;x<canva.width;x+=g.cell){
        g.map.push([])
        for (let y = 0;y<canva.height;y+=g.cell){
            g.map[x/g.cell].push({x:x,y:y,entropy:Object.keys(rules),collasped:false,layer:undefined,img:undefined})
        }
    }
}