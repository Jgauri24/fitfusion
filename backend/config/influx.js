const { InfluxDB } = require('@influxdata/influxdb-client');

/**
 * Configures the InfluxDB client for high-frequency time-series data (Environmental_Data).
 */
const INFLUX_URL = process.env.INFLUX_URL || 'http://localhost:8086';
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_ORG = process.env.INFLUX_ORG;
const INFLUX_BUCKET = process.env.INFLUX_BUCKET;

if (!INFLUX_TOKEN) {
    console.warn('InfluxDB token is missing. Environmental_Data features may fail.');
}

const influxClient = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
const writeApi = influxClient.getWriteApi(INFLUX_ORG, INFLUX_BUCKET, 'ns');
const queryApi = influxClient.getQueryApi(INFLUX_ORG);

module.exports = {
    influxClient,
    writeApi,
    queryApi
};
