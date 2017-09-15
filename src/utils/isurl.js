import {isString} from 'd3-let';


const schemes = ['http', 'https', 'ws', 'wss'];


export default function (value) {
    return isString(value) && schemes.indexOf(value.split('://')[0]) > -1;
}
