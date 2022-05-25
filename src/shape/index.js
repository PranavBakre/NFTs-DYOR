import {Shape} from "three"
export function getRoundedRectangle(length, breadth, radius, x = 0, y = 0 ) {
    let shape = new Shape();
    shape.moveTo( x, y + radius );
    shape.lineTo( x, y + breadth - radius );
    shape.quadraticCurveTo( x, y + breadth, x + radius, y + breadth );
    shape.lineTo( x + length - radius, y + breadth );
    shape.quadraticCurveTo( x + length, y + breadth, x + length, y + breadth - radius );
    shape.lineTo( x + length, y + radius );
    shape.quadraticCurveTo( x + length, y, x + length - radius, y );
    shape.lineTo( x + radius, y );
    shape.quadraticCurveTo( x, y, x, y + radius );

    return shape

}