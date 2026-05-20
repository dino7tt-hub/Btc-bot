// BTC MetaApi Trading Bot
// Bollinger Bands + EMA200 Strategy
// RR 1:2

import MetaApi from '@metaapi/cloud-sdk';
import { BollingerBands, EMA } from 'technicalindicators';

const token = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4N2RhNWMzMGU4MTIzMjk3MjdhOWJjNGQwM2M3ZTZkNSIsImFjY2Vzc1J1bGVzIjpbeyJpZCI6InRyYWRpbmctYWNjb3VudC1tYW5hZ2VtZW50LWFwaSIsIm1ldGhvZHMiOlsidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcmVzdC1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcmVhbC10aW1lLXN0cmVhbWluZy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJtZXRhc3RhdHMtYXBpIiwibWV0aG9kcyI6WyJtZXRhc3RhdHMtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoiY29weWZhY3RvcnktYXBpIiwibWV0aG9kcyI6WyJjb3B5ZmFjdG9yeS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibXQtbWFuYWdlci1hcGkiLCJtZXRob2RzIjpbIm10LW1hbmFnZXItYXBpOnJlc3Q6ZGVhbGluZzoqOioiLCJtdC1tYW5hZ2VyLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJiaWxsaW5nLWFwaSIsIm1ldGhvZHMiOlsiYmlsbGluZy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfV0sImlnbm9yZVJhdGVMaW1pdHMiOmZhbHNlLCJ0b2tlbklkIjoiMjAyMTAyMTMiLCJpbXBlcnNvbmF0ZWQiOmZhbHNlLCJyZWFsVXNlcklkIjoiODdkYTVjMzBlODEyMzI5NzI3YTliYzRkMDNjN2U2ZDUiLCJpYXQiOjE3NzkyNzI3NTAsImV4cCI6MTc4NzA0ODc1MH0.YqMY1urIM7-3nFpGt-fIIRCCqe52ecKI4p79Cze5Cge6dEiVEy1FVw3ALRqKtIn2WMczMBT0UUldCcgJujbe5nRcmuf2dKhzx8cM_qqa73rsnlHgFKs879jOog1Uz9sXKZ4dhMhc9O2feIhXsraLFII5AfzbkKBhoQkyN12W0U7sCvoF4xgHGWPCg9E-DDXqKwn06-zad37YL5qrOgbHDLqgoXBq1H9SHLbKHOZxg3WWKaBofU20nArIrgS_C45KIkAjWyVv_4FMiNdLXvg0a1gj4COIBgLSPF4jODQImZbJwra26b_ZshpS6ACqMl-dCY8w8Z6UKceYC64MK81W3Ia-4qXnNpyXtPmEBhZeqjLvNS8Qi10Xeq2rq0JDRPyvBEKJ6CB_YtF8Hluo-Vu4phzEVk0YjPJGMj-RnUyEtG4A6J8rv7vr7oZwbSch48sD6QqMw83kSzxHmG6cDBZSiYs_2K-Lls_ozG5XkD9lKWk3q3dgQl735nxXvX6oYNGmhSBElbIgTL8U6s-ndPIAbYIxaFUPULih-0bQUaUR8QgiJyhgSCteDyPqZdAk84coalxNWW57BNRpVUzntm8Ynfto2JP90tflR9M-5i4CPaHXmNTXFBPBr95ubAgZzaGPaPEayb51FShiN2bZCDkmK-pZL9g-DMjiAMHHm2yW4-8';
const accountId = '233bf776-62b4-4587-b43d-4756614a19f4';

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