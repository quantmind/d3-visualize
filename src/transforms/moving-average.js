import transformFactory from './base';
import minmax from '../utils/minmax';

const
    DEFAULT_METHOD = 'ema',   // or sma simple moving average
    DEFAULT_PERIOD = 10,
    DEFAULT_ALPHA = 0.5,
    MAXALPHA = 0.999999;

//
// Exponential moving average transform
// Useful for smoothing out volatile timeseries
export default transformFactory({
    shema: {
        description: "Create moving average series from existing one. The new series override the existing one unless the as array is provided",
        properties: {
            method: {
                type: "string"
            },
            alpha: {
                type: "number"
            },
            period: {
                type: "number"
            },
            fields: {
                type: "array",
                items: {
                    type: "string"
                }
            },
            as: {
                type: "array",
                items: {
                    type: "string"
                }
            }
        },
        required: ["fields"]
    },
    transform (frame, config) {
        const as = config.as || [],
            method = config.method || DEFAULT_METHOD;
        let fieldto, y, s;

        config.fields.forEach((field, index) => {
            fieldto = as[index] || field;
            //
            // Simple Moving Average
            if (method === 'sma') {
                const period = Math.max(config.period || DEFAULT_PERIOD, 1),
                    cumulate = [],
                    buffer = [];
                frame.data.forEach((d, index) => {
                    y = d[field];
                    if (cumulate.length === period) y -= buffer.splice(0, 1)[0];
                    buffer.push(y);
                    if (index) y += cumulate[cumulate.length-1];
                    cumulate.push(y);
                    d[fieldto] = y/cumulate.length;
                });
            //
            // Exponential moving average
            } else {
                const alpha = minmax(config.alpha || DEFAULT_ALPHA, 1-MAXALPHA, MAXALPHA);

                frame.data.forEach((d, index) => {
                    y = d[field];
                    if (!index) s = y;
                    else s = alpha*s + (1-alpha)*y;
                    d[fieldto] = s;
                });
            }
        });
    }
});
