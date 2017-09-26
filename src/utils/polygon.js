//
//  Custom Symbol type
//  =====================
//
//  Draw a polygon given an array of points
//  This can be used as type in a d3-shape symbol
export default function (points) {

    return {
        draw (context) {
            points.forEach((point, idx) => {
                if (!idx) context.moveTo(point[0], point[1]);
                else context.lineTo(point[0], point[1]);
            });
            context.closePath();
        }
    };
}
