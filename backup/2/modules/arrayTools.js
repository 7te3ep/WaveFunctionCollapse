import { randInt } from "./randomInt.js"

let rLen = (arr)=>{return arr.length-1}
let randArr = (arr) => {return arr[randInt(0,rLen(arr))]}

export {rLen,randArr}