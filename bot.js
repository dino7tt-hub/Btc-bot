// BTC MetaApi Trading Bot
// Bollinger Bands + EMA200 Strategy
// RR 1:2

import MetaApi from '@metaapi/cloud-sdk';
import { BollingerBands, EMA } from 'technicalindicators';

const token = 'YOUR_METAAPI_TOKEN';
const accountId = 'YOUR_ACCOUNT_ID';

const symbol = 'BTCUSD';
const lotSize = 0.01;

async function startBot() {

  const api = new MetaApi(token);

  const account =
    await api.metatraderAccountApi.getAccount(accountId);

  if (account.state !== 'DEPLOYED') {
    await account.deploy();
  }

  await account.waitConnected();

  const connection = account.getRPCConnection();

  await connection.connect();

  await connection.waitSynchronized();

  console.log('BOT CONNECTED');

  while (true) {

    try {

      const candles =
        await connection.getHistoricalCandles(
          symbol,
          '5m',
          new Date(),
          250
        );

      const closes =
        candles.map(c => c.close);

      const bb =
        BollingerBands.calculate({
          period: 20,
          values: closes,
          stdDev: 2
        });

      const ema200 =
        EMA.calculate({
          period: 200,
          values: closes
        });

      const lastPrice =
        closes[closes.length - 1];

      const lastBB =
        bb[bb.length - 1];

      const lastEMA =
        ema200[ema200.length - 1];

      // BUY SIGNAL
      if (
        lastPrice > lastEMA &&
        lastPrice <= lastBB.lower
      ) {

        const sl = lastPrice - 100;
        const tp = lastPrice + 200;

        console.log('BUY SIGNAL');

        await connection.createMarketBuyOrder(
          symbol,
          lotSize,
          sl,
          tp,
          'BTC BOT BUY'
        );
      }

      // SELL SIGNAL
      if (
        lastPrice < lastEMA &&
        lastPrice >= lastBB.upper
      ) {

        const sl = lastPrice + 100;
        const tp = lastPrice - 200;

        console.log('SELL SIGNAL');

        await connection.createMarketSellOrder(
          symbol,
          lotSize,
          sl,
          tp,
          'BTC BOT SELL'
        );
      }

    } catch (err) {

      console.log(err);

    }

    // WAIT 60 SECONDS
    await new Promise(r =>
      setTimeout(r, 60000)
    );
  }
}

startBot();