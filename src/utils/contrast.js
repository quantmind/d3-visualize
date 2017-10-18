import {color} from 'd3-color';


export default function (c, white, black) {
    c = color(c);
    return (c.r*0.299 + c.g*0.587 + c.b*0.114) > 186 ? (black || '#000') : (white || '#fff');
}
