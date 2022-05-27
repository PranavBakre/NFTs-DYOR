import {CanvasTexture} from "three"
export function convertTextToTexture(text, style) {
    const div = document.createElement("div");
    console.log(style)
    div.innerHTML = text
    Object.entries(style).forEach(([key, value]) => {
        div.style[key] = value
    })
    div.style.color = style.color ?? "white"

    div.style.fontWeight = style.fontWeight ?? "Bold"
    div.style.fontSize = style.fontSize ?? "21px"
    div.style.fontFamily = style.fontFamily ?? "Gilroy-Regular"
    
    document.getElementById("root").append(div)
    const canvas = document.createElement('canvas');
    
    canvas.width = div.offsetWidth; canvas.height = div.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = div.style.color ?? "white";
    ctx.font = div.style.fontWeight + " " + div.style.fontSize + " " + div.style.fontFamily
    ctx.fillText(div.innerHTML, 0, 20);
    console.log(canvas.width)
    return ({texture: new CanvasTexture(canvas), canvas: canvas});
}