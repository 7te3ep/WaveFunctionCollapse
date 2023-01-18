const canva = document.getElementById('canva')
const ctx = canva.getContext('2d')

canva.width = window.innerWidth
canva.height = window.innerHeight

window.addEventListener("resize",(e)=>{
    console.log(e)
    canva.width = window.innerWidth
    canva.height = window.innerHeight
})

export {canva,ctx}